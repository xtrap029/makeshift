<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_main',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
