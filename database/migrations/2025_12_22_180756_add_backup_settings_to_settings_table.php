<?php

use App\Models\Settings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Settings::firstOrCreate(
            ['key' => 'DB_BACKUP_LIMIT'],
            ['value' => '10']
        );

        Settings::firstOrCreate(
            ['key' => 'DB_BACKUP_FREQUENCY'],
            ['value' => 'daily']
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Settings::whereIn('key', ['DB_BACKUP_LIMIT', 'DB_BACKUP_FREQUENCY'])->delete();
    }
};
