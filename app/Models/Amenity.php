<?php

namespace App\Models;

use App\Traits\TracksUser;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory, TracksUser, Auditable;

    protected $fillable = [
        'name',
        'description',
        'icon',
    ];
}
