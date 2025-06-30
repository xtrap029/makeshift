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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->time('sun_start')->nullable();
            $table->time('sun_end')->nullable();
            $table->time('mon_start')->nullable();
            $table->time('mon_end')->nullable();
            $table->time('tue_start')->nullable();
            $table->time('tue_end')->nullable();
            $table->time('wed_start')->nullable();
            $table->time('wed_end')->nullable();
            $table->time('thu_start')->nullable();
            $table->time('thu_end')->nullable();
            $table->time('fri_start')->nullable();
            $table->time('fri_end')->nullable();
            $table->time('sat_start')->nullable();
            $table->time('sat_end')->nullable();
            $table->timestamps();

            $table->foreignId('owner_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_id')->nullable()->constrained('users')->onDelete('set null');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
