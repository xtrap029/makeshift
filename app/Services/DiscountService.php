<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Discount;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class DiscountService
{
    /**
     * Find the single discount that applies to a room for a given reservation date.
     *
     * A discount qualifies when it is active, has no coupon code, covers the room,
     * and both of its optional date windows contain the relevant date. Overlaps are
     * allowed — the LOWEST priority number wins (1 = highest priority), newest first
     * as the tiebreaker.
     *
     * @param  string  $reservationDate  The booking's start_date (Y-m-d)
     * @param  Carbon|null  $bookedOn  When the booking was submitted; defaults to now
     */
    public static function resolve(int $roomId, string $reservationDate, ?Carbon $bookedOn = null): ?Discount
    {
        $bookedOn = ($bookedOn ?? now())->format('Y-m-d');

        return Discount::where('is_active', true)
            ->whereNull('code')
            ->whereHas('rooms', function ($query) use ($roomId) {
                $query->where('rooms.id', $roomId);
            })
            ->where('book_from', '<=', $bookedOn)
            ->where('book_to', '>=', $bookedOn)
            ->where('reserve_from', '<=', $reservationDate)
            ->where('reserve_to', '>=', $reservationDate)
            ->orderBy('priority', 'asc')
            ->orderBy('id', 'desc')
            ->first();
    }

    /**
     * Per-day effective rate for a room across a date range — one query instead of
     * one per day. Answers "what would I pay if I booked today for day X", so the
     * booking-window side of the check uses today for every day in the range.
     *
     * @return array<string, array{price: float, original_price: float, discount_label: ?string}>
     */
    public static function pricingForRange(Room $room, string $from, string $to): array
    {
        $price = (float) $room->price;
        $bookedOn = now()->format('Y-m-d');

        $candidates = Discount::where('is_active', true)
            ->whereNull('code')
            ->whereHas('rooms', function ($query) use ($room) {
                $query->where('rooms.id', $room->id);
            })
            ->where('book_from', '<=', $bookedOn)
            ->where('book_to', '>=', $bookedOn)
            ->orderBy('priority', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        $result = [];
        $period = Carbon::parse($from)->toPeriod(Carbon::parse($to));

        foreach ($period as $day) {
            $date = $day->format('Y-m-d');

            $discount = $candidates->first(
                fn ($d) => $d->reserve_from->format('Y-m-d') <= $date && $d->reserve_to->format('Y-m-d') >= $date
            );

            $result[$date] = $discount
                ? [
                    'price' => round($price - $discount->perHourAmount($price), 2),
                    'original_price' => $price,
                    'discount_label' => $discount->label($price),
                ]
                : [
                    'price' => $price,
                    'original_price' => $price,
                    'discount_label' => null,
                ];
        }

        return $result;
    }

    /**
     * Discount preview for public-facing pages. Returns null when nothing applies.
     *
     * When no date is in play (a room card or a room page before the customer has
     * picked a date), a promo that hasn't started yet is advertised instead, flagged
     * with `upcoming` so callers know not to discount the displayed price.
     */
    public static function preview(Room $room, ?string $date = null): ?array
    {
        $discount = self::resolve($room->id, $date ?: now()->format('Y-m-d'));

        $upcoming = false;
        if (!$discount && !$date) {
            $discount = self::nextUpcoming($room->id);
            $upcoming = (bool) $discount;
        }

        if (!$discount) {
            return null;
        }

        $price = (float) $room->price;
        $perHour = $discount->perHourAmount($price);

        return [
            'id' => $discount->id,
            'name' => $discount->name,
            'type' => $discount->type,
            'value' => (float) $discount->value,
            'label' => $discount->label($price),
            'per_hour_amount' => $perHour,
            'discounted_price' => round($price - $perHour, 2),
            'upcoming' => $upcoming,
            'starts_on' => $upcoming ? $discount->reserve_from->format('Y-m-d') : null,
        ];
    }

    /**
     * The soonest promo for a room whose reservation window is still ahead of us.
     *
     * Restricted to discounts that are claimable *today* — advertising one whose
     * booking period hasn't opened would promise a price the customer can't get
     * by inquiring now.
     */
    private static function nextUpcoming(int $roomId): ?Discount
    {
        $today = now()->format('Y-m-d');

        return Discount::where('is_active', true)
            ->whereNull('code')
            ->whereHas('rooms', function ($query) use ($roomId) {
                $query->where('rooms.id', $roomId);
            })
            ->where('book_from', '<=', $today)
            ->where('book_to', '>=', $today)
            ->where('reserve_from', '>', $today)
            ->orderBy('reserve_from')
            ->orderBy('priority', 'asc')
            ->orderBy('id', 'desc')
            ->first();
    }

    /**
     * Write the discount snapshot onto a booking.
     *
     * Only 'auto' rows are touched — any coupon-sourced rows are left alone so a
     * future coupon feature can stack on top without being wiped by an admin edit.
     */
    public static function applyTo(Booking $booking): void
    {
        $auto = config('global.discount_source.auto')[0];

        $booking->discounts()->where('source', $auto)->delete();

        $booking->loadMissing('room');
        if (!$booking->room) {
            return;
        }

        $discount = self::resolve(
            $booking->room_id,
            Carbon::parse($booking->start_date)->format('Y-m-d'),
            $booking->created_at ? Carbon::parse($booking->created_at) : null
        );

        if (!$discount) {
            $booking->load('discounts');
            return;
        }

        // Each discount deducts from the ORIGINAL hourly rate — additive, never
        // compounding — so multiple rows stay order-independent.
        $perHour = $discount->perHourAmount((float) $booking->room->price);

        $booking->discounts()->create([
            'discount_id' => $discount->id,
            'name' => $discount->name,
            'type' => $discount->type,
            'value' => $discount->value,
            'amount' => round($perHour * $booking->total_hours() * $booking->qty, 2),
            'source' => $auto,
        ]);

        $booking->load('discounts');
    }

    /**
     * What recalculating would change, without writing anything — powers the
     * before/after confirmation shown to staff before they apply it.
     */
    public static function previewRecalculation(Booking $booking): array
    {
        $booking->loadMissing('room', 'discounts');

        $subtotal = $booking->subtotal();

        // Recalculating only rewrites the automatic row; a claimed voucher stays put,
        // so it has to be carried onto the "after" side too or the preview would show
        // the customer losing it.
        $voucherAmount = OfferService::appliedAmount($booking);

        $before = [
            'discounts' => $booking->discounts->map(fn ($d) => [
                'name' => $d->name,
                'type' => $d->type,
                'value' => (float) $d->value,
                'amount' => (float) $d->amount,
            ])->values(),
            'discount_amount' => $booking->discount_amount(),
            'total_price' => $booking->total_price(),
        ];

        $discount = self::resolve(
            $booking->room_id,
            Carbon::parse($booking->start_date)->format('Y-m-d'),
            $booking->created_at ? Carbon::parse($booking->created_at) : null
        );

        $afterDiscounts = $booking->discounts
            ->where('source', config('global.discount_source.voucher')[0])
            ->map(fn ($d) => [
                'name' => $d->name,
                'type' => $d->type,
                'value' => (float) $d->value,
                'amount' => (float) $d->amount,
            ])->values()->all();

        $afterAmount = 0.0;
        if ($discount) {
            $perHour = $discount->perHourAmount((float) $booking->room->price);
            $afterAmount = round($perHour * $booking->total_hours() * $booking->qty, 2);
            array_unshift($afterDiscounts, [
                'name' => $discount->name,
                'type' => $discount->type,
                'value' => (float) $discount->value,
                'amount' => $afterAmount,
            ]);
        }

        $afterTotalDeduction = round($afterAmount + $voucherAmount, 2);

        $after = [
            'discounts' => $afterDiscounts,
            'discount_amount' => $afterTotalDeduction,
            'total_price' => max(0, round($subtotal - $afterTotalDeduction, 2)),
        ];

        return [
            'subtotal' => $subtotal,
            'before' => $before,
            'after' => $after,
            'changed' => $before['discount_amount'] != $after['discount_amount']
                || $before['discounts']->pluck('name')->all() !== collect($afterDiscounts)->pluck('name')->all(),
        ];
    }

    /**
     * What the booking WOULD cost if it were priced against `$newDate` — shown to
     * staff in the reschedule dialog so they can see the locked total next to the
     * rate the new date would normally carry. Read-only: rescheduling never
     * rewrites the discount snapshot, so the current total stays as-is.
     */
    public static function previewReschedule(Booking $booking, string $newDate): array
    {
        $booking->loadMissing('room', 'discounts');

        $subtotal = $booking->subtotal();

        $current = [
            'discount_name' => $booking->discounts->pluck('name')->implode(', ') ?: null,
            'discount_amount' => $booking->discount_amount(),
            'total_price' => $booking->total_price(),
        ];

        $discount = self::resolve(
            $booking->room_id,
            Carbon::parse($newDate)->format('Y-m-d'),
            $booking->created_at ? Carbon::parse($booking->created_at) : null
        );

        // A claimed voucher is never re-resolved on a reschedule — it rides along
        // on both sides so the comparison isolates the automatic promo.
        $voucherAmount = OfferService::appliedAmount($booking);

        $wouldBeAmount = 0.0;
        if ($discount) {
            $perHour = $discount->perHourAmount((float) $booking->room->price);
            $wouldBeAmount = round($perHour * $booking->total_hours() * $booking->qty, 2);
        }

        $wouldBeTotalDeduction = round($wouldBeAmount + $voucherAmount, 2);

        $wouldBeNames = $booking->discounts
            ->where('source', config('global.discount_source.voucher')[0])
            ->pluck('name')
            ->prepend($discount?->name)
            ->filter()
            ->implode(', ');

        $wouldBe = [
            'discount_name' => $wouldBeNames ?: null,
            'discount_amount' => $wouldBeTotalDeduction,
            'total_price' => max(0, round($subtotal - $wouldBeTotalDeduction, 2)),
        ];

        return [
            'subtotal' => $subtotal,
            'current' => $current,
            'would_be' => $wouldBe,
            'changed' => $current['total_price'] != $wouldBe['total_price']
                || $current['discount_name'] !== $wouldBe['discount_name'],
        ];
    }

    /**
     * Discount fields for the customer emails. All null when the booking has no
     * discount, which is how the templates decide whether to render the rows.
     */
    public static function mailData(Booking $booking): array
    {
        $booking->loadMissing('discounts');

        if ($booking->discounts->isEmpty()) {
            return [
                'booking_subtotal' => null,
                'booking_discount' => null,
                'booking_discount_name' => null,
                'booking_deductions' => [],
            ];
        }

        $voucherSource = config('global.discount_source.voucher')[0];

        // One row per deduction so an automatic promo and a customer-claimed voucher
        // are named for what they are. The two legacy keys stay populated — they are
        // the combined figure, still used as the "any deduction at all?" flag in the
        // templates and by anything that hasn't moved to the itemised list.
        $deductions = $booking->discounts->map(fn ($d) => [
            'label' => (int) $d->source === $voucherSource ? 'Voucher' : 'Discount',
            'name' => $d->name,
            'amount' => 'PHP ' . number_format((float) $d->amount, 2, '.', ','),
        ])->values()->all();

        return [
            'booking_subtotal' => 'PHP ' . number_format($booking->subtotal(), 2, '.', ','),
            'booking_discount' => 'PHP ' . number_format($booking->discount_amount(), 2, '.', ','),
            'booking_discount_name' => $booking->discounts->pluck('name')->implode(', '),
            'booking_deductions' => $deductions,
        ];
    }

    /**
     * Other active discounts sharing at least one room and an intersecting
     * reservation window. Advisory only — used to badge rows in the admin list.
     */
    public static function overlaps(Discount $discount): Collection
    {
        $roomIds = $discount->rooms->pluck('id');

        if ($roomIds->isEmpty() || !$discount->is_active) {
            return new Collection();
        }

        return Discount::where('id', '!=', $discount->id)
            ->where('is_active', true)
            ->whereNull('code')
            ->whereHas('rooms', function ($query) use ($roomIds) {
                $query->whereIn('rooms.id', $roomIds);
            })
            ->where('reserve_from', '<=', $discount->reserve_to->format('Y-m-d'))
            ->where('reserve_to', '>=', $discount->reserve_from->format('Y-m-d'))
            ->get();
    }
}
