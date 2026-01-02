<?php

namespace App\Support;

use App\Models\Settings;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class BackupSettings
{
    public static function limit(): int
    {
        $settings = self::all();

        return (int) ($settings['DB_BACKUP_LIMIT'] ?? 10);
    }

    public static function frequency(): string
    {
        $settings = self::all();

        return $settings['DB_BACKUP_FREQUENCY'] ?? 'daily';
    }

    private static function all(): array
    {
        $cacheStore = config('cache.default', 'array');
        $cacheTable = config('cache.stores.database.table', 'cache');

        if ($cacheStore === 'database' && ! Schema::hasTable($cacheTable)) {
            $cacheStore = 'array';
        }

        return Cache::store($cacheStore)->rememberForever('backup_settings', function () {
            if (! Schema::hasTable((new Settings)->getTable())) {
                return [];
            }

            return Settings::whereIn('key', ['DB_BACKUP_LIMIT', 'DB_BACKUP_FREQUENCY'])
                ->pluck('value', 'key')
                ->toArray();
        });
    }

    public static function clearCache(): void
    {
        $cacheStore = config('cache.default', 'array');
        $cacheTable = config('cache.stores.database.table', 'cache');

        if ($cacheStore === 'database' && ! Schema::hasTable($cacheTable)) {
            $cacheStore = 'array';
        }

        Cache::store($cacheStore)->forget('backup_settings');
    }
}
