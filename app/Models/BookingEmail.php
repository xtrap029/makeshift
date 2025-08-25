<?php

namespace App\Models;

use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookingEmail extends Model
{
    use HasFactory, SoftDeletes, TracksUser;

    protected $fillable = [
        'booking_id',
        'email',
        'type',
        'is_sent',
        'raw_response',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
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
