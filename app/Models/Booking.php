<?php

namespace App\Models;

use App\Services\BookingService;
use App\Traits\TracksUser;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes, TracksUser;

    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'room_id',
        'layout_id',
        'note',
        'qty',
        'start_date',
        'start_time',
        'end_time',
        'status',
        'cancel_reason',
        'expires_at',
        'voucher_code',
        'voucher_sent_at',
    ];

    protected $appends = ['booking_id'];

    public function room()
    {
        return $this->belongsTo(Room::class)->withTrashed();
    }

    public function layout()
    {
        return $this->belongsTo(Layout::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
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

    public function total_price()
    {
        return $this->room->price * $this->total_hours() * $this->qty;
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
