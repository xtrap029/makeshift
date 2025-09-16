<?php

namespace App\Http\Controllers\Unauth;

use App\Http\Requests\Unauth\StoreInquireRequest;
use App\Models\Room;
use App\Services\RoomAvailabilityService;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Layout;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mail\InquirySubmitted;
use App\Models\Settings;
use Illuminate\Support\Facades\Mail;
use App\Services\BookingService;

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

        $legal = Settings::whereIn('key', ['LEGAL_TERMS', 'LEGAL_PRIVACY', 'LEGAL_RULES'])->pluck('value', 'key');

        return Inertia::render('unauth/reservation/inquire', [
            'inquiry' => $validated,
            'room' => $room,
            'legal' => [
                'terms' => $legal['LEGAL_TERMS'] ?? null,
                'privacy' => $legal['LEGAL_PRIVACY'] ?? null,
                'rules' => $legal['LEGAL_RULES'] ?? null,
            ],
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

        try {
            $booking = Booking::create([
                'customer_name' => $validated['name'],
                'customer_email' => $validated['email'],
                'customer_phone' => $validated['phone'],
                'room_id' => $room->id,
                'layout_id' => Layout::where('name', $validated['layout'])->first()->id,
                'note' => $validated['note'],
                'qty' => 1,
                'start_date' => $validated['date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'status' => config('global.booking_status.inquiry')[0],
            ]);

            $booking = $booking->fresh();

            Mail::to($validated['email'])->send(new InquirySubmitted([
                'name' => $validated['name'],
                'booking_id' => BookingService::generateBookingId($booking),
                'booking_room' => $room->name . ' (' . $validated['layout'] . ')',
                'booking_date' => $booking->start_date,
                'booking_time' => $booking->start_time . ' - ' . $booking->end_time,
                'booking_note' => $booking->note,
                'booking_room_price' => 'PHP ' . number_format($room->price, 2, '.', ','),
                'booking_total_hours' => $booking->total_hours(),
                'booking_total_price' => 'PHP ' . number_format($booking->total_price(), 2, '.', ','),
            ]));

            return to_route('reservation.inquire.success');
        } catch (\Exception $e) {
            Log::error('Booking creation failed', [
                'error' => $e->getMessage(),
                'data'  => $validated,
            ]);
            return to_route('spaces')->withError('Failed to submit inquiry');
        }
    }

    public function inquireSuccess()
    {
        return Inertia::render('unauth/reservation/success', [
            'type' => 'inquire',
        ]);
    }
}
