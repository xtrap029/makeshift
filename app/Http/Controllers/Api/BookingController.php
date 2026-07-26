<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomImage;
use App\Services\DiscountService;
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
