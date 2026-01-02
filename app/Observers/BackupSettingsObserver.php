<?php

namespace App\Observers;

use App\Models\Settings;
use App\Support\BackupSettings;

class BackupSettingsObserver
{
    /**
     * Handle the Settings "created" event.
     */
    public function created(Settings $settings): void
    {
        $this->clearBackupCacheIfNeeded($settings);
    }

    /**
     * Handle the Settings "updated" event.
     */
    public function updated(Settings $settings): void
    {
        $this->clearBackupCacheIfNeeded($settings);
    }

    /**
     * Handle the Settings "deleted" event.
     */
    public function deleted(Settings $settings): void
    {
        $this->clearBackupCacheIfNeeded($settings);
    }

    /**
     * Handle the Settings "restored" event.
     */
    public function restored(Settings $settings): void
    {
        $this->clearBackupCacheIfNeeded($settings);
    }

    /**
     * Handle the Settings "force deleted" event.
     */
    public function forceDeleted(Settings $settings): void
    {
        $this->clearBackupCacheIfNeeded($settings);
    }

    private function clearBackupCacheIfNeeded(Settings $settings): void
    {
        if (in_array($settings->key, ['DB_BACKUP_LIMIT', 'DB_BACKUP_FREQUENCY'])) {
            BackupSettings::clearCache();
        }
    }
}
