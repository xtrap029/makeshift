<?php

namespace App\Http\Controllers\Settings\Website;

use App\Http\Controllers\Controller;
use App\Models\Room;
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
        $data = Settings::whereIn('key', [
            'SITE_DESCRIPTION',
            'SITE_EMAIL',
            'SITE_PHONE',
            'OFFICE_ADDRESS',
            'OFFICE_GOOGLE_MAP',
            'HOME_YOUTUBE_TEXT',
            'HOME_YOUTUBE_LINK',
            'HOME_MAP_TEXT',
            'HOME_MAP_LINK',
            'HOME_WHO_TITLE',
            'HOME_WHO_DESCRIPTION',
            'HOME_FEATURED_ID',
            'HOME_FEATURED_DESCRIPTION',
            'HOME_ROOM_SLIDER',
        ])->pluck('value', 'key');

        $rooms = Room::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('settings/website/appearance', [
            'websiteAppearance' => [
                'siteDescription' => $data['SITE_DESCRIPTION'] ?? null,
                'siteEmail' => $data['SITE_EMAIL'] ?? null,
                'sitePhone' => $data['SITE_PHONE'] ?? null,
                'siteAddress' => $data['OFFICE_ADDRESS'] ?? null,
                'siteGoogleMap' => $data['OFFICE_GOOGLE_MAP'] ?? null,
                'homeYoutubeText' => $data['HOME_YOUTUBE_TEXT'] ?? null,
                'homeYoutubeLink' => $data['HOME_YOUTUBE_LINK'] ?? null,
                'homeMapText' => $data['HOME_MAP_TEXT'] ?? null,
                'homeMapLink' => $data['HOME_MAP_LINK'] ?? null,
                'homeWhoTitle' => $data['HOME_WHO_TITLE'] ?? null,
                'homeWhoDescription' => $data['HOME_WHO_DESCRIPTION'] ?? null,
                'homeFeaturedId' => $data['HOME_FEATURED_ID'] ?? null,
                'homeFeaturedDescription' => $data['HOME_FEATURED_DESCRIPTION'] ?? null,
                'homeRoomSlider' => $data['HOME_ROOM_SLIDER'] ?? null,
            ],
            'rooms' => $rooms,
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
            'siteAddress' => 'nullable|string|max:255',
            'siteGoogleMap' => 'nullable|string|max:' . config('form.validation.map.max'),
            'homeYoutubeText' => 'nullable|string|max:255',
            'homeYoutubeLink' => 'nullable|string|max:' . config('form.validation.youtube.max'),
            'homeMapText' => 'nullable|string|max:255',
            'homeMapLink' => 'nullable|string|max:' . config('form.validation.map.max'),
            'homeWhoTitle' => 'nullable|string|max:255',
            'homeWhoDescription' => 'nullable|string',
            'homeFeaturedId' => 'nullable|string|max:255',
            'homeFeaturedDescription' => 'nullable|string',
            'homeRoomSlider' => 'nullable|string|max:255',
        ]);

        $settings = [
            'SITE_DESCRIPTION' => $validated['siteDescription'],
            'SITE_EMAIL' => $validated['siteEmail'],
            'SITE_PHONE' => $validated['sitePhone'],
            'OFFICE_ADDRESS' => $validated['siteAddress'],
            'OFFICE_GOOGLE_MAP' => $validated['siteGoogleMap'],
            'HOME_YOUTUBE_TEXT' => $validated['homeYoutubeText'],
            'HOME_YOUTUBE_LINK' => $validated['homeYoutubeLink'],
            'HOME_MAP_TEXT' => $validated['homeMapText'],
            'HOME_MAP_LINK' => $validated['homeMapLink'],
            'HOME_WHO_TITLE' => $validated['homeWhoTitle'],
            'HOME_WHO_DESCRIPTION' => $validated['homeWhoDescription'],
            'HOME_FEATURED_ID' => $validated['homeFeaturedId'],
            'HOME_FEATURED_DESCRIPTION' => $validated['homeFeaturedDescription'],
            'HOME_ROOM_SLIDER' => $validated['homeRoomSlider'],
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
