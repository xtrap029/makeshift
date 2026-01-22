<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DatabaseController extends Controller
{
    public function index(): Response
    {
        $disk = Storage::disk('local');

        $backups = collect($disk->files('backups'))
            ->map(function (string $file) use ($disk): array {
                $lastModified = $disk->lastModified($file);
                $filename = basename($file);

                return [
                    'name' => $filename,
                    'size' => $disk->size($file),
                    'lastModified' => Carbon::createFromTimestamp($lastModified)->toIso8601String(),
                    'downloadUrl' => route('database.backups.download', ['file' => $this->encodeFilename($filename)]),
                    '_sortTimestamp' => $lastModified,
                ];
            })
            ->sortByDesc('_sortTimestamp')
            ->map(function (array $backup): array {
                unset($backup['_sortTimestamp']);

                return $backup;
            })
            ->values();

        return Inertia::render('database/index', [
            'backups' => $backups,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $exitCode = Artisan::call('app:backup-database');

        if ($exitCode !== Command::SUCCESS) {
            return back()->with('error', 'Backup failed. Please check the logs.');
        }

        return back()->with('success', 'Backup created successfully.');
    }

    public function download(string $file): StreamedResponse
    {
        // Decode the URL-safe base64-encoded filename to avoid ModSecurity issues
        $filename = $this->decodeFilename($file);
        $filename = basename($filename);

        $path = "backups/{$filename}";
        $disk = Storage::disk('local');

        abort_unless($disk->exists($path), 404);

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $response = $disk->download($path, $filename);

        // Add headers to help bypass ModSecurity
        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', sprintf('attachment; filename="%s"', $filename));
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }

    /**
     * Encode filename using URL-safe base64 encoding to avoid ModSecurity issues.
     */
    private function encodeFilename(string $filename): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($filename));
    }

    /**
     * Decode URL-safe base64 encoded filename.
     */
    private function decodeFilename(string $encoded): string
    {
        // Replace URL-safe characters back to standard base64
        $encoded = str_replace(['-', '_'], ['+', '/'], $encoded);

        // Add padding if needed
        $padding = strlen($encoded) % 4;
        if ($padding !== 0) {
            $encoded .= str_repeat('=', 4 - $padding);
        }

        $decoded = base64_decode($encoded, true);

        // Fallback to original if decoding fails (for backward compatibility)
        return $decoded !== false ? $decoded : $encoded;
    }
}
