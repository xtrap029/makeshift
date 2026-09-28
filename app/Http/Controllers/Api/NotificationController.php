<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

/**
 * Polled by the admin layout to drive browser notifications for new inquiries
 * (tab dot, title count, toast, desktop notification). Polling rather than push
 * because the host can't keep a long-running process alive for WebSockets.
 */
class NotificationController extends Controller
{
    public function inquiries(Request $request)
    {
        $user = $request->user();

        // First poll ever: start counting from now. Otherwise the very first page
        // load would announce the whole backlog of open inquiries as "new".
        if (!$user->inquiries_seen_at) {
            $user->forceFill(['inquiries_seen_at' => now()])->save();

            return response()->json(['unseen_count' => 0, 'latest' => []]);
        }

        // Still-open inquiries that arrived since this user last opened Bookings.
        // One moved on to Pending/Canceled has been handled, so it stops counting.
        $unseen = Booking::where('status', config('global.booking_status.inquiry')[0])
            ->where('created_at', '>', $user->inquiries_seen_at);

        $latest = (clone $unseen)
            ->with('room:id,name')
            ->orderByDesc('id')
            ->limit(5)
            ->get(['id', 'customer_name', 'room_id', 'start_date', 'created_at'])
            ->map(fn (Booking $booking) => [
                'id' => $booking->id,
                'booking_id' => $booking->booking_id,
                'customer_name' => $booking->customer_name,
                'room' => $booking->room?->name,
                'start_date' => $booking->start_date,
                'created_at' => $booking->created_at,
            ]);

        return response()->json([
            'unseen_count' => $unseen->count(),
            'latest' => $latest,
        ]);
    }
}
