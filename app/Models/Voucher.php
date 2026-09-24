<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A customer-selectable offer. Unlike a Discount — which resolves automatically
 * and picks a single winner by priority — a Voucher is gated behind criteria
 * (minimum hours and/or minimum spend), shown to the customer as a claimable
 * card, and stacks on top of whatever automatic discount already applies.
 *
 * Not to be confused with VoucherService, which generates the check-in code on
 * a confirmed booking. Unrelated concepts, unfortunate name overlap.
 */
class Voucher extends Model
{
    use HasFactory, SoftDeletes, TracksUser, Auditable;

    protected $fillable = [
        'name',
        'description',
        'type',
        'value',
        'min_hours',
        'min_spend',
        'book_from',
        'book_to',
        'reserve_from',
        'reserve_to',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'book_from' => 'date:Y-m-d',
        'book_to' => 'date:Y-m-d',
        'reserve_from' => 'date:Y-m-d',
        'reserve_to' => 'date:Y-m-d',
        'is_active' => 'boolean',
    ];

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_voucher');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_id');
    }

    /**
     * Per-hour deduction this voucher produces against a given hourly rate.
     * Fixed amounts are clamped so a rate can never go negative.
     */
    public function perHourAmount(float $price): float
    {
        if ($this->type == config('global.discount_type.percentage')[0]) {
            return round($price * ((float) $this->value / 100), 2);
        }

        return round(min((float) $this->value, $price), 2);
    }

    public function label(float $price): string
    {
        if ($this->type == config('global.discount_type.percentage')[0]) {
            return rtrim(rtrim(number_format((float) $this->value, 2, '.', ''), '0'), '.') . '% OFF';
        }

        return 'PHP ' . number_format($this->perHourAmount($price), 2, '.', ',') . ' OFF/hr';
    }

    /**
     * Human-readable unlock condition for the voucher card.
     */
    public function criteriaLabel(): string
    {
        $parts = [];

        if ($this->min_hours) {
            $parts[] = 'Book ' . $this->min_hours . '+ hour' . ($this->min_hours > 1 ? 's' : '');
        }

        if ($this->min_spend) {
            $parts[] = 'Spend PHP ' . number_format((float) $this->min_spend, 2, '.', ',') . '+';
        }

        return $parts ? implode(' and ', $parts) : 'No minimum';
    }

    /**
     * Every non-null criterion must be met. Spend is checked against the booking
     * subtotal BEFORE any discount, so qualification doesn't shift as promos change.
     */
    public function qualifies(float $hours, float $subtotal): bool
    {
        if ($this->min_hours && $hours < $this->min_hours) {
            return false;
        }

        if ($this->min_spend && $subtotal < (float) $this->min_spend) {
            return false;
        }

        return true;
    }
}
