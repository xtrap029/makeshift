<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'image',
        'link_url',
        'order',
        'is_temp',
    ];
}
