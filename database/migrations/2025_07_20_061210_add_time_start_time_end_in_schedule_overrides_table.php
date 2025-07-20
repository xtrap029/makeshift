<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('schedule_overrides', function (Blueprint $table) {
            $table->time('time_start')->after('date')->nullable();
            $table->time('time_end')->after('time_start')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schedule_overrides', function (Blueprint $table) {
            $table->dropColumn('time_start');
            $table->dropColumn('time_end');
        });
    }
};
