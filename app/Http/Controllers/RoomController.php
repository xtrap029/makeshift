<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Amenity;
use App\Models\Room;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('rooms/index', [
            'rooms' => Room::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('rooms/create', [
            'amenities' => Amenity::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomRequest $request)
    {
        $validated = $request->validated();

        $room = Room::create($validated);

        if (isset($validated['amenities'])) {
            $room->amenities()->attach($validated['amenities']);
        }

        if (isset($validated['image'])) {
            $room->image()->create([
                'name' => $validated['image']->store('rooms', 'public'),
                'is_main' => true,
            ]);
        }

        return to_route('rooms.index')->withSuccess('Room created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        $room->load('image', 'amenities');

        return Inertia::render('rooms/show', [
            'room' => $room,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        $room->load('image', 'amenities');

        return Inertia::render('rooms/edit', [
            'amenities' => Amenity::orderBy('name')->get(),
            'room' => $room,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, Room $room)
    {
        $validated = $request->validated();

        $room->update($validated);

        if (isset($validated['amenities'])) {
            $room->amenities()->sync($validated['amenities']);
        } else {
            $room->amenities()->detach();
        }

        if (isset($validated['image'])) {
            if ($room->image) {
                Storage::disk('public')->delete($room->image->name);
                $room->image->delete();
            }

            $room->image()->updateOrCreate([
                'name' => $validated['image']->store('rooms', 'public'),
                'is_main' => true,
            ]);
        }

        return to_route('rooms.index')->withSuccess('Room updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $room->delete();

        return to_route('rooms.index')->withSuccess('Room deleted successfully!');
    }
}
