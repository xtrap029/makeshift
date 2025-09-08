<?php

namespace App\Http\Controllers\Settings\Website;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AppearanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Settings::pluck('value', 'key');

        return Inertia::render('settings/website/appearance', [
            'websiteAppearance' => [
                'siteDescription' => $data['SITE_DESCRIPTION'] ?? null,
                'siteEmail' => $data['SITE_EMAIL'] ?? null,
                'sitePhone' => $data['SITE_PHONE'] ?? null,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'logo' => 'nullable|image|mimes:' . config('global.settings.logo_mimes') . '|max:' . config('global.settings.logo_max_size'),
            'favicon' => 'nullable|mimes:' . config('global.settings.favicon_mimes') . '|max:' . config('global.settings.favicon_max_size'),
            'siteDescription' => 'nullable|string|max:' . config('global.settings.site_description_max_size'),
            'siteEmail' => 'required|email|max:255',
            'sitePhone' => 'required|string|max:255',
        ]);

        $settings = [
            'SITE_DESCRIPTION' => $validated['siteDescription'],
            'SITE_EMAIL'       => $validated['siteEmail'],
            'SITE_PHONE'       => $validated['sitePhone'],
        ];

        foreach ($settings as $key => $value) {
            Settings::where('key', $key)->update(['value' => $value]);
        }

        if (isset($validated['logo'])) {
            $validated['logo']->move(public_path(), 'logo.png');
        }

        if (isset($validated['favicon'])) {
            $validated['favicon']->move(public_path(), 'favicon.ico');
        }

        cache()->forget('website_settings');

        return to_route('settings.website.appearance')->withSuccess('Appearance updated successfully!');
    }
}
