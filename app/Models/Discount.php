<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Discount extends Model
{
    use HasFactory, SoftDeletes, TracksUser, Auditable;

    protected $fillable = [
        'name',
        'description',
        'type',
        'value',
        'book_from',
        'book_to',
        'reserve_from',
        'reserve_to',
        'priority',
        'is_active',
        'code',
        'max_uses',
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
        return $this->belongsToMany(Room::class, 'discount_room');
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
     * Per-hour deduction this discount produces against a given hourly rate.
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
}
