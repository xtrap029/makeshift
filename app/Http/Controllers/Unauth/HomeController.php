<?php

namespace App\Http\Controllers\Unauth;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Settings::pluck('value', 'key');

        $featuredRoom = Room::with('image')->find($data['HOME_FEATURED_ID']);

        $roomSlider = Room::with('image')->whereIn('id', explode(',', $data['HOME_ROOM_SLIDER']))->get();

        return Inertia::render('unauth/home/index', [
            'websiteAppearance' => [
                'homeYoutubeText' => $data['HOME_YOUTUBE_TEXT'] ?? null,
                'homeYoutubeLink' => $data['HOME_YOUTUBE_LINK'] ?? null,
                'homeMapText' => $data['HOME_MAP_TEXT'] ?? null,
                'homeMapLink' => $data['HOME_MAP_LINK'] ?? null,
                'homeWhoTitle' => $data['HOME_WHO_TITLE'] ?? null,
                'homeWhoDescription' => $data['HOME_WHO_DESCRIPTION'] ?? null,
                'homeFeaturedRoom' => $featuredRoom,
                'homeFeaturedDescription' => $data['HOME_FEATURED_DESCRIPTION'] ?? null,
            ],
            'roomSlider' => $roomSlider,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
