<?php

namespace App\Http\Controllers\Api\Unauth;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Services\DiscountService;
use App\Services\RoomAvailabilityService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RoomCalendarController extends Controller
{
    /**
     * Per-day rate + closed/open flag for a room across a bounded date range —
     * powers the public booking date picker's fare-calendar view. Read-only,
     * unauthenticated (public site), and deliberately cheap: a handful of
     * queries total regardless of range size, not one per day.
     */
    public function index(Request $request, string $roomName, RoomAvailabilityService $roomAvailabilityService)
    {
        $validated = $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $room = Room::select('id', 'name', 'price', 'schedule_id')
            ->where('is_active', true)
            ->where('name', $roomName)
            ->firstOrFail();

        $from = Carbon::parse($validated['from']);
        $to = Carbon::parse($validated['to']);

        // Cap the range so a crafted request can't force an oversized loop.
        if ($from->diffInDays($to) > 62) {
            $to = $from->copy()->addDays(62);
        }

        $from = $from->format('Y-m-d');
        $to = $to->format('Y-m-d');

        $pricing = DiscountService::pricingForRange($room, $from, $to);
        $closedDays = $roomAvailabilityService->closedDaysForRange($room, $from, $to);

        $days = [];
        foreach ($pricing as $date => $rate) {
            $days[$date] = [
                'price' => $rate['price'],
                'original_price' => $rate['original_price'],
                'discount_label' => $rate['discount_label'],
                'closed' => in_array($date, $closedDays, true),
            ];
        }

        return response()->json(['days' => $days]);
    }
}
