<?php

namespace App\Models;

use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    use TracksUser;

    protected $fillable = [
        'key',
        'value',
    ];
}
