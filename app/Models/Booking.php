<?php

namespace App\Models;

use App\Traits\TracksUser;
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
        'expires_at',
        'voucher_code',
        'voucher_sent_at',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function layout()
    {
        return $this->belongsTo(Layout::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_id');
    }
}
