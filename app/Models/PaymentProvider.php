<?php

namespace App\Models;

use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentProvider extends Model
{
    use TracksUser, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'is_manual',
        'is_active',
        'is_default',
    ];
}
