<?php

namespace App\Traits;

use App\Models\Audit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(
            fn(Model $model) =>
            self::logAudit($model, 'created')
        );

        static::updated(
            fn(Model $model) =>
            self::logAudit($model, 'updated')
        );

        static::deleted(
            fn(Model $model) =>
            self::logAudit($model, 'deleted')
        );
    }

    protected static function logAudit(Model $model, string $event)
    {
        Audit::create([
            'auditable_type' => get_class($model),
            'auditable_id'   => $model->getKey(),
            'user_id'        => Auth::user()?->id,
            'event'          => $event,
            'old_values'     => $event === 'updated'
                ? $model->getOriginal()
                : null,
            'new_values'     => $model->getDirty(),
        ]);
    }

    public function audits()
    {
        return $this->morphMany(Audit::class, 'auditable');
    }
}
