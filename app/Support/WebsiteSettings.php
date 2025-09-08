<?php

namespace App\Support;

use App\Models\Settings;

class WebsiteSettings
{
    public static function all(): array
    {
        $settings = cache()->rememberForever('website_settings', function () {
            return Settings::pluck('value', 'key')->toArray();
        });

        return [
            'bankAccount'     => $settings['EMAIL_BANK_ACCOUNT'] ?? null,
            'supportLink'     => $settings['EMAIL_SUPPORT_LINK'] ?? null,
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
