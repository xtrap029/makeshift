<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait TracksUser
{
    public static function bootTracksUser()
    {
        static::creating(function ($model) {
            if (Auth::check()) {
                $model->owner_id = Auth::id();
                $model->updated_id = Auth::id();
            }
        });

        static::updating(function ($model) {
            if (Auth::check()) {
                $model->updated_id = Auth::id();
            }
        });
    }
}
