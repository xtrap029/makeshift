<?php

use App\Console\Commands\BackupDatabase;
use App\Console\Commands\UpdateExpiredBookings;
use App\Support\BackupSettings;
use Illuminate\Support\Facades\Schedule;

Schedule::command(UpdateExpiredBookings::class)->everyMinute();

// Clear cache to ensure we get the latest frequency setting
BackupSettings::clearCache();
$backupFrequency = strtolower(BackupSettings::frequency());
$backupCommand = Schedule::command(BackupDatabase::class);

// Normalize frequency values (handle both "every 12 hours" and "every_12_hours" formats)
$normalizedFrequency = str_replace(' ', '_', $backupFrequency);

match ($normalizedFrequency) {
    'every_12_hours' => $backupCommand->cron('0 */12 * * *'),
    'daily' => $backupCommand->cron('* * * * *'),
    // 'daily' => $backupCommand->dailyAt('02:00'),
    'every_two_days' => $backupCommand->cron('0 2 */2 * *'),
    'weekly' => $backupCommand->weekly()->sundays()->at('02:00'),
    'biweekly' => $backupCommand->cron('0 2 */14 * *'),
    'monthly' => $backupCommand->monthly()->at('02:00'),
    default => $backupCommand->dailyAt('02:00'),
};
