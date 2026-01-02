<?php

namespace App\Http\Controllers\Settings\Website;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DatabaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Settings::whereIn('key', [
            'DB_BACKUP_LIMIT',
            'DB_BACKUP_FREQUENCY',
        ])->pluck('value', 'key');

        return Inertia::render('settings/website/database', [
            'databaseSettings' => [
                'backupLimit' => $data['DB_BACKUP_LIMIT'] ?? null,
                'backupFrequency' => $data['DB_BACKUP_FREQUENCY'] ?? null,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'backupLimit' => 'required|integer',
            'backupFrequency' => 'required|string',
        ]);

        $settings = [
            'DB_BACKUP_LIMIT' => $validated['backupLimit'],
            'DB_BACKUP_FREQUENCY' => $validated['backupFrequency'],
        ];

        foreach ($settings as $key => $value) {
            Settings::where('key', $key)->update(['value' => $value]);
        }

        return to_route('settings.website.database')->withSuccess('Database settings updated successfully!');
    }
}
