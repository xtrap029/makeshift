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
        ]);

        $settings = [
            'EMAIL_BANK_ACCOUNT' => $validated['bankAccount'],
            'EMAIL_SUPPORT_LINK' => $validated['supportLink'],
        ];

        foreach ($settings as $key => $value) {
            Settings::where('key', $key)->update(['value' => $value]);
        }

        cache()->forget('website_settings');

        return to_route('settings.email.appearance')->withSuccess('Appearance updated successfully!');
    }
}
