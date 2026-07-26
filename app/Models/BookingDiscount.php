<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Immutable snapshot of a discount as it applied to a booking. Values here are
 * frozen copies — never read the live Discount record when computing totals.
 */
class BookingDiscount extends Model
{
    protected $fillable = [
        'booking_id',
        'discount_id',
        'name',
        'type',
        'value',
        'amount',
        'source',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class)->withTrashed();
    }
}
