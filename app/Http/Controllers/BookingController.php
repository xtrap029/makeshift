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

        $booking = Booking::create($validated);

        return to_route('bookings.show', $booking)->withSuccess('Booking created successfully!');
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

        $failed_message = "Status update failed.";

        switch ($validated['status']) {
            case 'pending':
                // Booking should be draft
                if ($booking->status !== config('global.booking_status.draft')[0]) {
                    return back()->withError($failed_message . ' Booking is not draft');
                }

                // Room: Active
                if (!$booking->room->is_active) {
                    return back()->withError($failed_message . ' Room is not active');
                }

                // Room: max Qty. is enough
                if ($booking->room->qty < $booking->qty) {
                    return back()->withError($failed_message . ' Room has not enough quantity');
                }

                // Loop through each hour to check if there are:
                // - Schedule override, Schedule, Bookings
                for ($i = ltrim(substr($booking->start_time, 0, 2), '0'); $i <= ltrim(substr($booking->end_time, 0, 2), '0'); $i++) {
                    // Override: honor last entry
                    $scheduleOverride = ScheduleOverride::where('date', $booking->start_date)
                        ->whereHas('rooms', function ($query) use ($booking) {
                            $query->where('room_id', $booking->room_id);
                        })
                        ->where('time_start', '<=', sprintf('%02d:00', $i))
                        ->where('time_end', '>=', $i < ltrim(substr($booking->end_time, 0, 2), '0') ? sprintf('%02d:01', $i) : sprintf('%02d:00', $i))
                        ->orderBy('created_at', 'desc')
                        ->first();

                    if ($scheduleOverride) {
                        if (!$scheduleOverride->is_open) {
                            return back()->withError($failed_message . ' Room is not open on this date. Please check the schedule override.');
                        }
                    } else {
                        // get date day
                        $dateDay = strtolower(date('D', strtotime($booking->start_date)));

                        // Schedule: is active, max day, max date
                        $schedule = Schedule::where('id', $booking->room->schedule_id)
                            ->where('is_active', true)
                            ->where('max_day', '>=', now()->diffInDays($booking->start_date))
                            ->where('max_date', '>=', $booking->start_date)
                            ->where($dateDay . '_start', '<=', sprintf('%02d:00', $i))
                            ->where($dateDay . '_end', '>=', sprintf('%02d:00', $i))
                            ->first();

                        if (!$schedule) {
                            return back()->withError($failed_message . ' Schedule is not set for this date. Please check the schedule.');
                        }
                    }

                    // Bookings: with Pending or Confirmed status from date/time
                    $bookings = Booking::where('room_id', $booking->room_id)
                        ->whereNotIn('status', [config('global.booking_status.draft')[0], config('global.booking_status.cancelled')[0]])
                        ->where('start_date', $booking->start_date)
                        ->where('start_time', '<=', $i < ltrim(substr($booking->start_time, 0, 2), '0') ? sprintf('%02d:00', $i) : sprintf('%02d:59', $i - 1))
                        ->where('end_time', '>=', $i < ltrim(substr($booking->end_time, 0, 2), '0') ? sprintf('%02d:01', $i) : sprintf('%02d:00', $i))
                        ->where('id', '!=', $booking->id)
                        ->get();
                    if ($bookings->count() > 0 && $booking->room->qty - $bookings->sum('qty') < $booking->qty) {
                        return back()->withError($failed_message . ' Room is already booked on this date/time. Please check the bookings.');
                    }
                }

                $booking->update(['status' => config('global.booking_status.pending')[0]]);
                break;
            case 'draft':
                // Booking should be pending
                if ($booking->status !== config('global.booking_status.pending')[0] && $booking->status !== config('global.booking_status.cancelled')[0]) {
                    return back()->withError($failed_message . ' Booking is not pending or cancelled');
                }

                $booking->update(['status' => config('global.booking_status.draft')[0]]);
                break;
            case 'cancelled':
                // Booking should be pending
                if ($booking->status !== config('global.booking_status.pending')[0]) {
                    return back()->withError($failed_message . ' Booking is not pending');
                }

                $booking->update(['status' => config('global.booking_status.cancelled')[0]]);
                break;
            default:
                return back()->withError($failed_message . ' Invalid status');
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
