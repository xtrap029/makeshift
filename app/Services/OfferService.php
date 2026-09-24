<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Voucher;
use Carbon\Carbon;

/**
 * Customer-selectable vouchers, as opposed to the automatic promos handled by
 * DiscountService. A voucher is gated behind criteria (minimum hours and/or
 * minimum spend) and stacks on top of whatever automatic discount applies —
 * both deduct from the ORIGINAL hourly rate, so they stay order-independent.
 *
 * Named OfferService to avoid colliding with VoucherService, which generates
 * the check-in code on a confirmed booking.
 */
class OfferService
{
    /**
     * Every voucher claimable for a room on a given reservation date, qualifying
     * or not — the UI greys out the ones whose criteria aren't met yet so the
     * customer can see what's within reach.
     *
     * @param  float  $hours  Booking duration
     * @param  int  $qty  Units booked
     * @param  Carbon|null  $bookedOn  When the booking was/will be submitted; defaults to now
     * @return array<int, array<string, mixed>>
     */
    public static function availableFor(
        Room $room,
        string $reservationDate,
        float $hours,
        int $qty = 1,
        ?Carbon $bookedOn = null
    ): array {
        $bookedOn = ($bookedOn ?? now())->format('Y-m-d');
        $price = (float) $room->price;
        $subtotal = round($price * $hours * $qty, 2);

        $vouchers = Voucher::where('is_active', true)
            ->whereHas('rooms', function ($query) use ($room) {
                $query->where('rooms.id', $room->id);
            })
            ->where('book_from', '<=', $bookedOn)
            ->where('book_to', '>=', $bookedOn)
            ->where('reserve_from', '<=', $reservationDate)
            ->where('reserve_to', '>=', $reservationDate)
            ->orderBy('priority', 'asc')
            ->orderBy('min_hours', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        return $vouchers->map(function (Voucher $voucher) use ($price, $hours, $qty, $subtotal) {
            $perHour = $voucher->perHourAmount($price);
            $qualifies = $voucher->qualifies($hours, $subtotal);

            return [
                'id' => $voucher->id,
                'name' => $voucher->name,
                'description' => $voucher->description,
                'type' => $voucher->type,
                'value' => (float) $voucher->value,
                'min_hours' => $voucher->min_hours ? (int) $voucher->min_hours : null,
                'min_spend' => $voucher->min_spend !== null ? (float) $voucher->min_spend : null,
                'criteria_label' => $voucher->criteriaLabel(),
                'label' => $voucher->label($price),
                'per_hour_amount' => $perHour,
                // Lets the inquiry modal recompute a min_spend subtotal client-side.
                'room_price' => $price,
                'total_savings' => round($perHour * $hours * $qty, 2),
                'qualifies' => $qualifies,
                'shortfall' => $qualifies ? null : self::shortfall($voucher, $hours, $subtotal),
            ];
        })->all();
    }

    /**
     * The vouchers running on a room for a date, WITHOUT the hours-dependent parts.
     *
     * The inquiry modal lets the customer change the time range as they go, so
     * qualification and savings are recomputed client-side from these criteria as
     * the selection changes (see resources/js/utils/vouchers.ts). Purely
     * presentational — applyTo() re-validates everything server-side regardless.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function catalogFor(Room $room, string $reservationDate, ?Carbon $bookedOn = null): array
    {
        return array_map(
            fn ($offer) => collect($offer)
                ->except(['total_savings', 'qualifies', 'shortfall'])
                ->all(),
            self::availableFor($room, $reservationDate, 0, 1, $bookedOn)
        );
    }

    /**
     * What's still missing before the voucher unlocks, for the card's hint text.
     */
    private static function shortfall(Voucher $voucher, float $hours, float $subtotal): array
    {
        return [
            'hours' => $voucher->min_hours && $hours < $voucher->min_hours
                ? round($voucher->min_hours - $hours, 2)
                : null,
            'spend' => $voucher->min_spend && $subtotal < (float) $voucher->min_spend
                ? round((float) $voucher->min_spend - $subtotal, 2)
                : null,
        ];
    }

    /**
     * Freeze the chosen voucher onto the booking as a deduction row, replacing any
     * voucher already applied. Passing null just removes it.
     *
     * Everything is re-validated here rather than trusted from the request — this
     * is the only write path, so a tampered id simply results in no voucher.
     * Automatic discount rows (source 1) are never touched.
     */
    public static function applyTo(Booking $booking, ?int $voucherId): void
    {
        $source = config('global.discount_source.voucher')[0];

        $booking->discounts()->where('source', $source)->delete();

        $booking->loadMissing('room');

        if (!$voucherId || !$booking->room) {
            $booking->load('discounts');
            return;
        }

        $voucher = self::resolveClaimable($booking, $voucherId);

        if (!$voucher) {
            $booking->load('discounts');
            return;
        }

        $perHour = $voucher->perHourAmount((float) $booking->room->price);

        $booking->discounts()->create([
            'voucher_id' => $voucher->id,
            'name' => $voucher->name,
            'type' => $voucher->type,
            'value' => $voucher->value,
            'amount' => round($perHour * $booking->total_hours() * $booking->qty, 2),
            'source' => $source,
        ]);

        $booking->load('discounts');
    }

    /**
     * The voucher, only if this booking may actually claim it right now.
     */
    private static function resolveClaimable(Booking $booking, int $voucherId): ?Voucher
    {
        $reservationDate = Carbon::parse($booking->start_date)->format('Y-m-d');
        $bookedOn = ($booking->created_at ? Carbon::parse($booking->created_at) : now())->format('Y-m-d');

        $voucher = Voucher::where('id', $voucherId)
            ->where('is_active', true)
            ->whereHas('rooms', function ($query) use ($booking) {
                $query->where('rooms.id', $booking->room_id);
            })
            ->where('book_from', '<=', $bookedOn)
            ->where('book_to', '>=', $bookedOn)
            ->where('reserve_from', '<=', $reservationDate)
            ->where('reserve_to', '>=', $reservationDate)
            ->first();

        if (!$voucher) {
            return null;
        }

        return $voucher->qualifies($booking->total_hours(), $booking->subtotal()) ? $voucher : null;
    }

    /**
     * Why the voucher frozen onto this booking would no longer be claimable, or
     * null when it's still fine (or there is none).
     *
     * Editing a booking deliberately never re-prices it on its own — the same rule
     * the automatic discount follows — so a voucher claimed for a 6-hour stay stays
     * put when staff shorten it to 2. This surfaces that on the booking page so the
     * staleness is visible and one click away from being fixed, rather than silently
     * discounting a booking that no longer earns it.
     *
     * @return array{name: string, amount: float, reasons: string[], current_amount: float|null}|null
     */
    public static function staleApplied(Booking $booking): ?array
    {
        $booking->loadMissing('room', 'discounts');

        $row = $booking->discounts
            ->firstWhere('source', config('global.discount_source.voucher')[0]);

        if (!$row) {
            return null;
        }

        $reasons = [];
        $currentAmount = null;

        $voucher = $row->voucher_id ? Voucher::find($row->voucher_id) : null;

        if (!$voucher) {
            $reasons[] = 'The voucher has been deleted.';
        } else {
            if (!$voucher->is_active) {
                $reasons[] = 'The voucher is no longer active.';
            }

            if (!$booking->room || !$voucher->rooms()->where('rooms.id', $booking->room_id)->exists()) {
                $reasons[] = 'It does not cover this booking\'s room.';
            }

            $reservationDate = Carbon::parse($booking->start_date)->format('Y-m-d');
            if (
                $voucher->reserve_from->format('Y-m-d') > $reservationDate
                || $voucher->reserve_to->format('Y-m-d') < $reservationDate
            ) {
                $reasons[] = 'The booking date falls outside its reservation window.';
            }

            $hours = $booking->total_hours();
            $subtotal = $booking->subtotal();

            if ($voucher->min_hours && $hours < $voucher->min_hours) {
                $reasons[] = sprintf(
                    'Needs %d+ hours — this booking is %s.',
                    $voucher->min_hours,
                    rtrim(rtrim(number_format($hours, 2, '.', ''), '0'), '.') . 'h'
                );
            }

            if ($voucher->min_spend && $subtotal < (float) $voucher->min_spend) {
                $reasons[] = sprintf(
                    'Needs a PHP %s+ subtotal — this booking is PHP %s.',
                    number_format((float) $voucher->min_spend, 2, '.', ','),
                    number_format($subtotal, 2, '.', ',')
                );
            }

            if ($booking->room) {
                $currentAmount = round(
                    $voucher->perHourAmount((float) $booking->room->price) * $hours * $booking->qty,
                    2
                );

                if (!$reasons && $currentAmount != (float) $row->amount) {
                    $reasons[] = sprintf(
                        'The amount was worked out as PHP %s but would now be PHP %s.',
                        number_format((float) $row->amount, 2, '.', ','),
                        number_format($currentAmount, 2, '.', ',')
                    );
                }
            }
        }

        if (!$reasons) {
            return null;
        }

        return [
            'name' => $row->name,
            'amount' => (float) $row->amount,
            'current_amount' => $currentAmount,
            'reasons' => $reasons,
        ];
    }

    /**
     * Total already frozen onto the booking from a voucher. The discount previews
     * add this to both sides so recalculating the automatic promo never appears
     * to wipe out the customer's claimed voucher.
     */
    public static function appliedAmount(Booking $booking): float
    {
        $booking->loadMissing('discounts');

        return round(
            (float) $booking->discounts
                ->where('source', config('global.discount_source.voucher')[0])
                ->sum('amount'),
            2
        );
    }
}
