<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomImage;
use App\Services\DiscountService;
use App\Services\RoomAvailabilityService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Read-only preview of what recalculating the discount snapshot would change,
     * so staff can review before/after before committing to it.
     */
    public function previewDiscount(Booking $booking)
    {
        return response()->json(DiscountService::previewRecalculation($booking));
    }

    /**
     * Everything the reschedule dialog needs for a candidate date: which start slots
     * fit the booking's original duration (its own reservation is ignored so it can
     * shift within the same day) and the locked total vs. what the new date would
     * normally cost.
     */
    public function rescheduleOptions(Request $request, Booking $booking, RoomAvailabilityService $availability)
    {
        if ($booking->status !== config('global.booking_status.confirmed')[0]) {
            return response()->json(['message' => 'Only confirmed bookings can be rescheduled.'], 422);
        }

        $validated = $request->validate([
            'date' => 'required|date_format:Y-m-d|after:today',
        ]);

        $booking->load('room');
        $hours = (int) $booking->total_hours();

        $times = $availability->availableTimesForDate($booking->room, $validated['date'], $booking->id);

        return response()->json([
            'hours' => $hours,
            'start_times' => $availability->availableStartTimes($times, $hours),
            'pricing' => DiscountService::previewReschedule($booking, $validated['date']),
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'voucherCode' => 'required|string|max:255',
        ]);

        $verifiedBooking = Booking::with(['layout', 'room'])
            ->where('voucher_code', $request->voucherCode)
            ->where('status', config('global.booking_status.confirmed')[0])
            ->first();

        return response()->json(['verifiedBooking' => $verifiedBooking]);
    }
}
