<?php

namespace App\Http\Controllers\Settings\Website;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Settings::pluck('value', 'key');

        return Inertia::render('settings/website/legal', [
            'legalAppearance' => [
                'legalTerms' => $data['LEGAL_TERMS'] ?? null,
                'legalPrivacy' => $data['LEGAL_PRIVACY'] ?? null,
                'legalRules' => $data['LEGAL_RULES'] ?? null,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'legalTerms' => 'required|string',
            'legalPrivacy' => 'required|string',
            'legalRules' => 'nullable|string',
        ]);

        $settings = [
            'LEGAL_TERMS' => $validated['legalTerms'],
            'LEGAL_PRIVACY' => $validated['legalPrivacy'],
            'LEGAL_RULES' => $validated['legalRules'],
        ];

        foreach ($settings as $key => $value) {
            Settings::where('key', $key)->update(['value' => $value]);
        }

        return to_route('settings.website.legal')->withSuccess('Legal updated successfully!');
    }
}
