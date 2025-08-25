<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Amenity;
use App\Models\Layout;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\ScheduleOverrideRoom;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('room/index', [
            'rooms' => Room::with('schedule')->orderBy('name')->paginate(config('global.pagination_limit')),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('room/create', [
            'amenities' => Amenity::orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
            'schedules' => Schedule::orderBy('name')->get(),
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

        if (isset($validated['layouts'])) {
            $room->layouts()->attach($validated['layouts']);
        }

        if (isset($validated['schedule_id'])) {
            $room->schedule()->associate($validated['schedule_id']);
            $room->save();
        }

        if (isset($validated['image'])) {
            $room->image()->create([
                'name' => $validated['image']->store('rooms', 'public'),
                'is_main' => true,
            ]);
        }

        return to_route('rooms.show', $room)->withSuccess('Room created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room, Request $request)
    {
        $room->load('image', 'amenities', 'layouts', 'schedule');
        if ($room->schedule) {
            $room->schedule->max_date = Carbon::parse($room->schedule->max_date)->diffForHumans();
        }

        $booking_date = $request->filled('booking') ? $request->booking : now()->format('Y-m-d');

        $room->load(['bookings' => function ($query) use ($booking_date) {
            $query->where('start_date', $booking_date)
                ->whereIn('status', [config('global.booking_status.pending')[0], config('global.booking_status.confirmed')[0]])
                ->with('layout');
        }]);

        $room->overrides = ScheduleOverrideRoom::where('room_id', $room->id)
            ->join('schedule_overrides', 'schedule_override_rooms.schedule_override_id', '=', 'schedule_overrides.id')
            ->where('schedule_overrides.date', '>=', now())
            ->orderBy('schedule_overrides.date', 'asc')
            ->select('schedule_overrides.*')
            ->get();

        return Inertia::render('room/show', [
            'room' => $room,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        $room->load('image', 'amenities', 'layouts', 'schedule');

        return Inertia::render('room/edit', [
            'amenities' => Amenity::orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
            'schedules' => Schedule::orderBy('name')->get(),
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

        if (isset($validated['layouts'])) {
            $room->layouts()->sync($validated['layouts']);
        } else {
            $room->layouts()->detach();
        }

        if (isset($validated['schedule_id'])) {
            $room->schedule()->associate($validated['schedule_id']);
            $room->save();
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

        return to_route('rooms.show', $room)->withSuccess('Room updated successfully!');
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
