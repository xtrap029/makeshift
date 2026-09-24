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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->tinyInteger('type')->default(1);
            $table->decimal('value', 10, 2)->default(0);
            // Criteria — at least one is set. A voucher qualifies only when EVERY
            // non-null criterion is met by the booking.
            $table->unsignedTinyInteger('min_hours')->nullable();
            $table->decimal('min_spend', 10, 2)->nullable();
            $table->date('book_from');
            $table->date('book_to');
            $table->date('reserve_from');
            $table->date('reserve_to');
            $table->integer('priority')->default(0);
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('vouchers');
    }
};
