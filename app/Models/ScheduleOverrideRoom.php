<?php

namespace App\Models;

use App\Traits\TracksUser;
use Illuminate\Database\Eloquent\Model;

class ScheduleOverrideRoom extends Model
{
    use TracksUser;

    protected $fillable = [
        'schedule_override_id',
        'room_id',
    ];

    public function scheduleOverride()
    {
        return $this->belongsTo(ScheduleOverride::class);
    }
}
