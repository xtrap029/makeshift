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
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('booking/index', [
            'bookings' => Booking::with('room', 'layout')->orderBy('created_at', 'desc')->get(),
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

        Booking::create($validated);

        return to_route('bookings.index')->withSuccess('Booking created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        $booking->load('room', 'layout', 'owner', 'updater');

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
        $validated = $request->validated();

        $booking->update($validated);

        return to_route('bookings.index')->withSuccess('Booking updated successfully!');
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking)
    {
        $validated = $request->validated();

        $failed_message = "Status update failed.";

        // Room: Active
        if (!$booking->room->is_active) {
            return back()->withError($failed_message . ' Room is not active');
        }

        // Room: max Qty. is enough
        if ($booking->room->qty < $booking->qty) {
            return back()->withError($failed_message . ' Room has not enough quantity');
        }

        // Override: honor last entry
        $scheduleOverride = ScheduleOverride::where('date', $booking->start_date)
            ->whereHas('rooms', function ($query) use ($booking) {
                $query->where('room_id', $booking->room_id);
            })
            ->orderBy('created_at', 'desc')
            ->first();
        if ($scheduleOverride) {
            if (!$scheduleOverride->is_open) {
                return back()->withError($failed_message . ' Room is not open on this date. Please check the schedule override.');
            }
        } else {
            // Schedule: is active, max day, max date
            $schedule = Schedule::where('id', $booking->room->schedule_id)
                ->where('is_active', true)
                ->where('max_day', '>=', now()->diffInDays($booking->start_date))
                ->where('max_date', '>=', $booking->start_date)
                ->first();
            if (!$schedule) {
                return back()->withError($failed_message . ' Schedule is not set for this date. Please check the schedule.');
            }

            // consider time as well
        }

        // - Bookings: with Pending or Confirmed status from date/time
        //     - Check qty remaining

        if (false) {
            $booking->update($validated);
        }

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
