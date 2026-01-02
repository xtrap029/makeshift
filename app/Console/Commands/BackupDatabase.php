<?php

namespace App\Console\Commands;

use App\Support\BackupSettings;
use Illuminate\Console\Command;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:backup-database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a database backup and store it in storage/app/private/backups';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Clear cache to ensure we have the latest settings
        BackupSettings::clearCache();

        $disk = Storage::disk('local');
        $disk->makeDirectory('backups');

        $timestamp = now()->format('Y-m-d_H-i-s');
        $connection = config('database.default');
        $config = config("database.connections.{$connection}");

        if (! $config || ! isset($config['driver'])) {
            $this->error('Database configuration not found.');

            return self::FAILURE;
        }

        if ($config['driver'] === 'mysql' || $config['driver'] === 'mariadb') {
            return $this->backupMysql($disk, $config, $timestamp);
        }

        if ($config['driver'] === 'sqlite') {
            return $this->backupSqlite($disk, $config['database'], $timestamp);
        }

        $this->error("Unsupported database driver [{$config['driver']}].");

        return self::FAILURE;
    }

    private function backupSqlite(Filesystem $disk, string $database, string $timestamp): int
    {
        $databasePath = $database;

        if (! str_starts_with($databasePath, '/')) {
            $databasePath = database_path($databasePath);
        }

        if (! file_exists($databasePath)) {
            $this->error("SQLite database file not found at [{$databasePath}].");

            return self::FAILURE;
        }

        $backupPath = "backups/backup_{$timestamp}.sqlite";
        $contents = @file_get_contents($databasePath);

        if ($contents === false) {
            $this->error("Unable to read database file at [{$databasePath}].");

            return self::FAILURE;
        }

        $disk->put($backupPath, $contents);
        $this->info("Backup saved to {$backupPath}");

        try {
            $this->cleanupOldBackups($disk);
        } catch (\Exception $e) {
            $this->warn("Cleanup failed: {$e->getMessage()}");
        }

        return self::SUCCESS;
    }

    private function backupMysql(Filesystem $disk, array $config, string $timestamp): int
    {
        if (empty($config['database'])) {
            $this->error('Database name not configured.');

            return self::FAILURE;
        }

        $backupPath = "backups/backup_{$timestamp}.sql";

        $command = ['mysqldump'];

        // Use unix socket if provided, otherwise use host/port
        if (! empty($config['unix_socket'])) {
            $command[] = '--socket=' . $config['unix_socket'];
        } else {
            $command[] = '--host=' . ($config['host'] ?? '127.0.0.1');
            $command[] = '--port=' . (string) ($config['port'] ?? 3306);
        }

        $command[] = '--user=' . ($config['username'] ?? 'root');
        $command[] = '--single-transaction';
        $command[] = '--quick';
        $command[] = '--lock-tables=false';
        $command[] = '--triggers';
        $command[] = '--add-drop-table';
        $command[] = $config['database'];

        $process = new Process(
            $command,
            null,
            [
                'MYSQL_PWD' => (string) ($config['password'] ?? ''),
            ]
        );

        $process->setTimeout(300); // 5 minutes timeout

        $process->run();

        if (! $process->isSuccessful()) {
            $this->error('Backup failed: ' . $process->getErrorOutput());

            return self::FAILURE;
        }

        $disk->put($backupPath, $process->getOutput());
        $this->info("Backup saved to {$backupPath}");

        try {
            $this->cleanupOldBackups($disk);
        } catch (\Exception $e) {
            $this->warn("Cleanup failed: {$e->getMessage()}");
        }

        return self::SUCCESS;
    }

    private function cleanupOldBackups(Filesystem $disk): void
    {
        if (! $disk->exists('backups')) {
            return;
        }

        $backups = collect($disk->files('backups'))
            ->filter(function (string $file): bool {
                return str_starts_with(basename($file), 'backup_');
            })
            ->map(function (string $file) use ($disk): array {
                return [
                    'path' => $file,
                    'lastModified' => $disk->lastModified($file),
                ];
            })
            ->sortBy('lastModified')
            ->values();

        $maxBackups = BackupSettings::limit();

        if ($backups->count() > $maxBackups) {
            $toDelete = $backups->take($backups->count() - $maxBackups);

            foreach ($toDelete as $backup) {
                if ($disk->exists($backup['path'])) {
                    $disk->delete($backup['path']);
                    $this->info("Deleted old backup: {$backup['path']}");
                }
            }
        }
    }
}
