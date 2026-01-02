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

                return [
                    'name' => basename($file),
                    'size' => $disk->size($file),
                    'lastModified' => Carbon::createFromTimestamp($lastModified)->toIso8601String(),
                    'downloadUrl' => route('database.backups.download', ['file' => basename($file)]),
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
        $file = basename($file);
        $path = "backups/{$file}";
        $disk = Storage::disk('local');

        abort_unless($disk->exists($path), 404);

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        return $disk->download($path);
    }
}
