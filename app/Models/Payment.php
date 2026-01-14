<?php

namespace App\Models;

use App\Traits\TracksUser;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes, TracksUser, Auditable;

    protected $fillable = [
        'booking_id',
        'payment_provider_id',
        'note',
        'status',
        'reference_number',
        'pr_no',
        'amount',
        'amount_paid',
        'paid_at',
        'raw_response',
        'attachment',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function payment_provider()
    {
        return $this->belongsTo(PaymentProvider::class);
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
