<?php

namespace App\Http\Controllers;

use App\Http\Requests\Unauth\StoreInquireRequest;
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
    public function inquire(string $roomName, StoreInquireRequest $request)
    {
        $validated = $request->validated();

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

        $availability = $this->roomAvailabilityService->verifyRoomAvailability($room, 1, $validated['date'], $validated['start_time'], $validated['end_time']);
        if (!$availability['status']) {
            return to_route('spaces', ['date' => $validated['date']])->withError($availability['message']);
        }

        return Inertia::render('unauth/reservation/inquire', [
            'inquiry' => $validated,
            'room' => $room,
        ]);
    }

    public function inquireStore(string $roomName, StoreInquireRequest $request)
    {
        $validated = $request->validated();

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

        $availability = $this->roomAvailabilityService->verifyRoomAvailability($room, 1, $validated['date'], $validated['start_time'], $validated['end_time']);
        if (!$availability['status']) {
            return to_route('spaces', ['date' => $validated['date']])->withError($availability['message']);
        }

        return to_route('spaces', ['date' => $validated['date']])->withSuccess('Inquiry submitted successfully');
    }
}
