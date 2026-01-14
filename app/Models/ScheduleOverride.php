<?php

namespace App\Models;

use App\Traits\TracksUser;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class ScheduleOverride extends Model
{
    use TracksUser, Auditable;

    protected $fillable = [
        'date',
        'time_start',
        'time_end',
        'is_open',
        'note',
    ];

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'schedule_override_rooms');
    }

    public function scheduleOverrideRooms()
    {
        return $this->hasMany(ScheduleOverrideRoom::class);
    }
}
