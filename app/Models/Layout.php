<?php

namespace App\Models;

use App\Traits\TracksUser;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class Layout extends Model
{
    use TracksUser, Auditable;

    protected $fillable = [
        'name',
        'description',
    ];
}
