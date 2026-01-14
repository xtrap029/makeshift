<?php

namespace App\Models;

use App\Traits\TracksUser;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentProvider extends Model
{
    use TracksUser, SoftDeletes, Auditable;

    protected $fillable = [
        'name',
        'description',
        'is_manual',
        'is_active',
        'is_default',
    ];
}
