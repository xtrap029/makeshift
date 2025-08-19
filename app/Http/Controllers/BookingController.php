<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Models\Booking;
use App\Models\Layout;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\ScheduleOverride;
use App\Services\RoomAvailabilityService;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected $roomAvailabilityService;

    public function __construct(RoomAvailabilityService $roomAvailabilityService)
    {
        $this->roomAvailabilityService = $roomAvailabilityService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('booking/index', [
            'bookings' => Booking::with('room', 'layout')->orderBy('created_at', 'desc')->paginate(config('global.pagination_limit')),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('booking/create', [
            'rooms' => Room::where('is_active', true)->orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        $validated = $request->validated();

        $validated['status'] = config('global.booking_status.draft')[0];

        $booking = Booking::create($validated);

        return to_route('bookings.show', $booking)->withSuccess('Booking created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        $booking->load('room', 'layout', 'owner', 'updater', 'payments.payment_provider');
        $booking->total_paid = $booking->total_paid();
        $booking->total_hours = $booking->total_hours();
        $booking->total_price = $booking->total_price();

        return Inertia::render('booking/show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        $booking->load('room', 'layout');

        return Inertia::render('booking/edit', [
            'booking' => $booking,
            'rooms' => Room::where('is_active', true)->orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        if (
            $booking->status !== config('global.booking_status.draft')[0]
            && $booking->status !== config('global.booking_status.pending')[0]
        ) {
            return back()->withError(config('messages.not_allowed'));
        }

        $validated = $request->validated();

        $booking->update($validated);

        return to_route('bookings.show', $booking)->withSuccess('Booking updated successfully!');
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking)
    {
        $validated = $request->validated();

        $failed_message = "Status update failed. ";

        switch ($validated['status']) {
            case 'pending':
                // Booking should be draft
                if ($booking->status !== config('global.booking_status.draft')[0]) {
                    return back()->withError($failed_message . ' Booking is not draft');
                }

                $availability = $this->roomAvailabilityService->verifyRoomAvailability($booking->room, $booking->qty, $booking->start_date, $booking->start_time, $booking->end_time);
                if (!$availability['status']) {
                    return back()->withError($failed_message . $availability['message']);
                }

                $booking->update(['status' => config('global.booking_status.pending')[0]]);
                break;
            case 'draft':
                // Booking should be pending
                if ($booking->status !== config('global.booking_status.pending')[0] && $booking->status !== config('global.booking_status.canceled')[0]) {
                    return back()->withError($failed_message . 'Booking is not pending or canceled');
                }

                $booking->update(['status' => config('global.booking_status.draft')[0]]);
                break;
            case 'confirmed':
                // Booking should be pending
                if ($booking->status !== config('global.booking_status.pending')[0]) {
                    return back()->withError($failed_message . 'Booking is not pending');
                }

                // Total paid should be equal or greater than total price
                if ($booking->total_paid() < $booking->total_price()) {
                    return back()->withError($failed_message . 'Total paid is less than total price');
                }

                $booking->update(['status' => config('global.booking_status.confirmed')[0]]);
                break;
            case 'canceled':
                // Booking should be pending
                if ($booking->status !== config('global.booking_status.pending')[0]) {
                    return back()->withError($failed_message . 'Booking is not pending');
                }

                $booking->update(['status' => config('global.booking_status.canceled')[0]]);
                break;
            default:
                return back()->withError($failed_message . 'Invalid status');
        }

        $booking->update(['expires_at' => null]);

        return to_route('bookings.show', $booking)->withSuccess('Booking status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        if ($booking->status !== config('global.booking_status.draft')[0]) {
            return back()->withError(config('messages.not_allowed'));
        }

        $booking->delete();

        return to_route('bookings.index')->withSuccess('Booking deleted successfully!');
    }
}
