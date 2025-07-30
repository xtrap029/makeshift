<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class BookingStatusService
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
}
