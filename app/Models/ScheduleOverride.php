<?php

namespace App\Models;

use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Model;

class ScheduleOverride extends Model
{
    use TracksUser;

    protected $fillable = [
        'date',
        'is_open',
        'note',
    ];

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'schedule_override_rooms');
    }
}
