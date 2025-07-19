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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->foreignId('room_id')->constrained('rooms')->onDelete('restrict');
            $table->foreignId('layout_id')->nullable()->constrained('layouts')->onDelete('set null');
            $table->string('note')->nullable();
            $table->integer('qty')->default(1);
            $table->date('start_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('status')->default(1);
            $table->datetime('expires_at')->nullable();
            $table->string('voucher_code')->nullable();
            $table->datetime('voucher_sent_at')->nullable();
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
        Schema::dropIfExists('bookings');
    }
};
