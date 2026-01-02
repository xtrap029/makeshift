<?php

namespace App\Support;

use App\Models\Settings;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class WebsiteSettings
{
    public static function all(): array
    {
        $cacheStore = config('cache.default', 'array');
        $cacheTable = config('cache.stores.database.table', 'cache');

        if ($cacheStore === 'database' && ! Schema::hasTable($cacheTable)) {
            $cacheStore = 'array';
        }

        $settings = Cache::store($cacheStore)->rememberForever('website_settings', function () {
            if (! Schema::hasTable((new Settings)->getTable())) {
                return [];
            }

            return Settings::pluck('value', 'key')->toArray();
        });

        return [
            'bankAccount' => $settings['EMAIL_BANK_ACCOUNT'] ?? null,
            'supportLink' => $settings['EMAIL_SUPPORT_LINK'] ?? null,
            'siteDescription' => $settings['SITE_DESCRIPTION'] ?? null,
        ];
    }

    public static function forBlade(): array
    {
        $all = self::all();

        return [
            'bankAccount' => $all['bankAccount'],
            'supportLink' => $all['supportLink'],
        ];
    }

    public static function forInertia(): array
    {
        $all = self::all();

        return [
            'siteDescription' => $all['siteDescription'],
        ];
    }
}
