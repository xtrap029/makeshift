<?php

namespace App\Http\Controllers\Settings\Email;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppearanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Settings::pluck('value', 'key');

        return Inertia::render('settings/email/appearance', [
            'emailAppearance' => [
                'bankAccount' => $data['EMAIL_BANK_ACCOUNT'] ?? null,
                'supportLink' => $data['EMAIL_SUPPORT_LINK'] ?? null,
                'footer1' => $data['EMAIL_FOOTER_1'] ?? null,
                'footer2' => $data['EMAIL_FOOTER_2'] ?? null,
                'templateInquiryWhatsNext' => $data['EMAIL_TEMPLATE_INQUIRY_WHATS_NEXT'] ?? null,
                'templateAcknowledgedPaymentSteps' => $data['EMAIL_TEMPLATE_ACKNOWLEDGED_PAYMENT_STEPS'] ?? null,
                'templateAcknowledgedScreenshot' => $data['EMAIL_TEMPLATE_ACKNOWLEDGED_SCREENSHOT'] ?? null,
                'templateAcknowledgedPaymentDeadline' => $data['EMAIL_TEMPLATE_ACKNOWLEDGED_PAYMENT_DEADLINE'] ?? null,
                'templateConfirmedArrival' => $data['EMAIL_TEMPLATE_CONFIRMED_ARRIVAL'] ?? null,
                'templateConfirmedAdditionalInfo' => $data['EMAIL_TEMPLATE_CONFIRMED_ADDITIONAL_INFO'] ?? null,
                'templateCancelledInquiry' => $data['EMAIL_TEMPLATE_CANCELLED_INQUIRY'] ?? null,
                'templateCancelledMeans' => $data['EMAIL_TEMPLATE_CANCELLED_MEANS'] ?? null,
                'templateCancelledNextSteps' => $data['EMAIL_TEMPLATE_CANCELLED_NEXT_STEPS'] ?? null,
                'templateCancelledAlternative' => $data['EMAIL_TEMPLATE_CANCELLED_ALTERNATIVE'] ?? null,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'bankAccount' => 'nullable|string|max:255',
            'supportLink' => 'nullable|string|max:255',
            'footer1' => 'nullable|string',
            'footer2' => 'nullable|string',
            'templateInquiryWhatsNext' => 'nullable|string',
            'templateAcknowledgedPaymentSteps' => 'nullable|string',
            'templateAcknowledgedScreenshot' => 'nullable|string',
            'templateAcknowledgedPaymentDeadline' => 'nullable|string',
            'templateConfirmedArrival' => 'nullable|string',
            'templateConfirmedAdditionalInfo' => 'nullable|string',
            'templateCancelledInquiry' => 'nullable|string',
            'templateCancelledMeans' => 'nullable|string',
            'templateCancelledNextSteps' => 'nullable|string',
            'templateCancelledAlternative' => 'nullable|string',
        ]);

        $settings = [
            'EMAIL_BANK_ACCOUNT' => $validated['bankAccount'],
            'EMAIL_SUPPORT_LINK' => $validated['supportLink'],
            'EMAIL_FOOTER_1' => $validated['footer1'],
            'EMAIL_FOOTER_2' => $validated['footer2'],
            'EMAIL_TEMPLATE_INQUIRY_WHATS_NEXT' => $validated['templateInquiryWhatsNext'],
            'EMAIL_TEMPLATE_ACKNOWLEDGED_PAYMENT_STEPS' => $validated['templateAcknowledgedPaymentSteps'],
            'EMAIL_TEMPLATE_ACKNOWLEDGED_SCREENSHOT' => $validated['templateAcknowledgedScreenshot'],
            'EMAIL_TEMPLATE_ACKNOWLEDGED_PAYMENT_DEADLINE' => $validated['templateAcknowledgedPaymentDeadline'],
            'EMAIL_TEMPLATE_CONFIRMED_ARRIVAL' => $validated['templateConfirmedArrival'],
            'EMAIL_TEMPLATE_CONFIRMED_ADDITIONAL_INFO' => $validated['templateConfirmedAdditionalInfo'],
            'EMAIL_TEMPLATE_CANCELLED_INQUIRY' => $validated['templateCancelledInquiry'],
            'EMAIL_TEMPLATE_CANCELLED_MEANS' => $validated['templateCancelledMeans'],
            'EMAIL_TEMPLATE_CANCELLED_NEXT_STEPS' => $validated['templateCancelledNextSteps'],
            'EMAIL_TEMPLATE_CANCELLED_ALTERNATIVE' => $validated['templateCancelledAlternative'],
        ];

        foreach ($settings as $key => $value) {
            Settings::where('key', $key)->update(['value' => $value]);
        }

        cache()->forget('email_settings');

        return to_route('settings.email.appearance')->withSuccess('Appearance updated successfully!');
    }
}
