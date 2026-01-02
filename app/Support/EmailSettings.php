<?php

namespace App\Support;

use App\Models\Settings;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class EmailSettings
{
    public static function all(): array
    {
        $cacheStore = config('cache.default', 'array');
        $cacheTable = config('cache.stores.database.table', 'cache');

        if ($cacheStore === 'database' && ! Schema::hasTable($cacheTable)) {
            $cacheStore = 'array';
        }

        $settings = Cache::store($cacheStore)->rememberForever('email_settings', function () {
            if (! Schema::hasTable((new Settings)->getTable())) {
                return [];
            }

            return Settings::pluck('value', 'key')->toArray();
        });

        return [
            'footer1' => $settings['EMAIL_FOOTER_1'] ?? null,
            'footer2' => $settings['EMAIL_FOOTER_2'] ?? null,
            'templateInquiryWhatsNext' => $settings['EMAIL_TEMPLATE_INQUIRY_WHATS_NEXT'] ?? null,
            'templateAcknowledgedPaymentSteps' => $settings['EMAIL_TEMPLATE_ACKNOWLEDGED_PAYMENT_STEPS'] ?? null,
            'templateAcknowledgedScreenshot' => $settings['EMAIL_TEMPLATE_ACKNOWLEDGED_SCREENSHOT'] ?? null,
            'templateAcknowledgedPaymentDeadline' => $settings['EMAIL_TEMPLATE_ACKNOWLEDGED_PAYMENT_DEADLINE'] ?? null,
            'templateConfirmedArrival' => $settings['EMAIL_TEMPLATE_CONFIRMED_ARRIVAL'] ?? null,
            'templateConfirmedAdditionalInfo' => $settings['EMAIL_TEMPLATE_CONFIRMED_ADDITIONAL_INFO'] ?? null,
            'templateCancelledInquiry' => $settings['EMAIL_TEMPLATE_CANCELLED_INQUIRY'] ?? null,
            'templateCancelledMeans' => $settings['EMAIL_TEMPLATE_CANCELLED_MEANS'] ?? null,
            'templateCancelledNextSteps' => $settings['EMAIL_TEMPLATE_CANCELLED_NEXT_STEPS'] ?? null,
            'templateCancelledAlternative' => $settings['EMAIL_TEMPLATE_CANCELLED_ALTERNATIVE'] ?? null,
        ];
    }

    public static function forBlade(): array
    {
        $all = self::all();

        return [
            'footer1' => $all['footer1'],
            'footer2' => $all['footer2'],
            'templateInquiryWhatsNext' => $all['templateInquiryWhatsNext'],
            'templateAcknowledgedPaymentSteps' => $all['templateAcknowledgedPaymentSteps'],
            'templateAcknowledgedScreenshot' => $all['templateAcknowledgedScreenshot'],
            'templateAcknowledgedPaymentDeadline' => $all['templateAcknowledgedPaymentDeadline'],
            'templateConfirmedArrival' => $all['templateConfirmedArrival'],
            'templateConfirmedAdditionalInfo' => $all['templateConfirmedAdditionalInfo'],
            'templateCancelledInquiry' => $all['templateCancelledInquiry'],
            'templateCancelledMeans' => $all['templateCancelledMeans'],
            'templateCancelledNextSteps' => $all['templateCancelledNextSteps'],
            'templateCancelledAlternative' => $all['templateCancelledAlternative'],
        ];
    }
}
