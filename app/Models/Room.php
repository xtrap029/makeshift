<?php

namespace App\Models;

use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    /** @use HasFactory<\Database\Factories\RoomFactory> */
    use HasFactory, SoftDeletes, TracksUser;

    protected $fillable = [
        'name',
        'description',
        'price',
        'is_active',
        'is_private',
        'sqm',
        'qty',
        'cap',
    ];

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'amenity_room');
    }

    public function image()
    {
        return $this->hasOne(RoomImage::class)->where('is_main', true);
    }

    public function images()
    {
        return $this->hasMany(RoomImage::class);
    }
}
