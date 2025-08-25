<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\Carbon;

class BookingService
{
    public static function updateExpiredBookings(): void
    {
        $now = Carbon::now()->setTimezone('Asia/Manila');

        Booking::where('status', config('global.booking_status.pending')[0])
            ->where('expires_at', '<', $now)
            ->update([
                'status' => config('global.booking_status.canceled')[0],
                'cancel_reason' => 'Expired: ' . $now->format('Y-m-d H:i:s'),
            ]);
    }

    public static function generateBookingId(Booking $booking): string
    {
        $booking->load('room');

        return 'MS-' . $booking->created_at->format('Ymd') . '-' . $booking->id;
    }
}
