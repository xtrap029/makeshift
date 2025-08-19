<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Services\RoomAvailabilityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    protected $roomAvailabilityService;

    public function __construct(RoomAvailabilityService $roomAvailabilityService)
    {
        $this->roomAvailabilityService = $roomAvailabilityService;
    }

    /**
     * Display a listing of the resource.
     */
    public function inquire(string $roomName, Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'layout' => 'required|exists:layouts,name',
        ]);

        $room = Room::select(
            'id',
            'name',
            'cap',
            'sqm',
            'description',
            'price',
            'schedule_id',
            'qty',
            'is_active'
        )->where('name', $roomName)->first();

        if (!$room) {
            return to_route('spaces')->withError('Space not found');
        }

        $availability = $this->roomAvailabilityService->verifyRoomAvailability($room, 1, $request->date, $request->start_time, $request->end_time);
        if (!$availability['status']) {
            return to_route('spaces', ['date' => $request->date])->withError($availability['message']);
        }

        return Inertia::render('unauth/reservation/inquire', [
            'inquiry' => $validated,
            'room' => $room,
        ]);
    }

    public function inquirePost(string $roomName, Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'layout' => 'required|exists:layouts,name',
            'name' => 'required|string|max:' . config('form.validation.name.max') . '|min:' . config('form.validation.name.min'),
            'email' => 'required|email|max:' . config('form.validation.email.max'),
            'phone' => 'required|string|min:' . config('form.validation.phone.min'),
            'note' => 'nullable|string|max:' . config('form.validation.note.max'),
        ]);

        $room = Room::select(
            'id',
            'name',
            'cap',
            'sqm',
            'description',
            'price',
            'schedule_id',
            'qty',
            'is_active'
        )->where('name', $roomName)->first();

        if (!$room) {
            return to_route('spaces')->withError('Space not found');
        }

        $availability = $this->roomAvailabilityService->verifyRoomAvailability($room, 1, $request->date, $request->start_time, $request->end_time);
        if (!$availability['status']) {
            return to_route('spaces', ['date' => $request->date])->withError($availability['message']);
        }

        return to_route('spaces', ['date' => $request->date])->withSuccess('Inquiry submitted successfully');
    }
}
