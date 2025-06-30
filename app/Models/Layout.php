<?php

namespace App\Models;

use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Model;

class Layout extends Model
{
    use TracksUser;

    protected $fillable = [
        'name',
        'description',
    ];
}
