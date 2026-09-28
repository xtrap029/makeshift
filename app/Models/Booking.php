<?php

namespace App\Models;

use App\Services\BookingService;
use App\Traits\Auditable;
use App\Traits\TracksUser;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes, TracksUser, Auditable;

    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'room_id',
        'layout_id',
        'note',
        'referred_by',
        'source_id',
        'qty',
        'start_date',
        'start_time',
        'end_time',
        'status',
        'cancel_reason',
        'expires_at',
        'voucher_code',
        'voucher_sent_at',
        'adjustment_amount',
        'adjustment_reason',
    ];

    protected $appends = ['booking_id'];

    /**
     * Drop the frozen deduction rows when the booking moves to a different room.
     *
     * Editing a booking deliberately never re-prices it — but a deduction computed
     * against another room's hourly rate is not a stale figure, it is a void one:
     * the promo or voucher may not even cover the new room, and the frozen amount
     * can exceed the new subtotal, which produced customer emails subtracting more
     * than the subtotal ("PHP 72.00 less PHP 2,700.00"). Clearing them is the only
     * state that stays coherent; staff re-apply via the recalculate icon and the
     * voucher picker.
     */
    protected static function booted(): void
    {
        static::updated(function (Booking $booking) {
            if ($booking->wasChanged('room_id')) {
                $booking->discounts()->delete();
                $booking->load('discounts');
            }
        });
    }

    public function room()
    {
        return $this->belongsTo(Room::class)->withTrashed();
    }

    public function layout()
    {
        return $this->belongsTo(Layout::class);
    }

    public function source()
    {
        return $this->belongsTo(Source::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function discounts()
    {
        return $this->hasMany(BookingDiscount::class);
    }

    public function total_paid()
    {
        return $this->payments->where('status', config('global.payment_status.paid')[0])->sum('amount_paid');
    }

    public function total_hours()
    {
        $start = Carbon::createFromFormat('H:i:s', $this->start_time);
        $end = Carbon::createFromFormat('H:i:s', $this->end_time);
        return $start->diffInMinutes($end) / 60;
    }

    public function subtotal()
    {
        return $this->room->price * $this->total_hours() * $this->qty;
    }

    public function discount_amount()
    {
        return round((float) $this->discounts->sum('amount'), 2);
    }

    /**
     * The staff-entered manual adjustment, signed: positive raises the total,
     * negative lowers it. Zero when none is set.
     *
     * Deliberately NOT named adjustment_amount(): a method sharing a column's name
     * is treated by Eloquent as a relationship whenever that column is absent from
     * the model's attributes (e.g. straight after create(), before a fresh()), and
     * then throws "must return a relationship instance". getAttribute() also keeps
     * this safe when the column hasn't been loaded.
     */
    public function adjustment_value(): float
    {
        return round((float) ($this->getAttribute('adjustment_amount') ?? 0), 2);
    }

    public function total_price()
    {
        return max(0, round($this->subtotal() - $this->discount_amount() + $this->adjustment_value(), 2));
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_id');
    }

    public function getBookingIdAttribute()
    {
        return BookingService::generateBookingId($this);
    }
}
