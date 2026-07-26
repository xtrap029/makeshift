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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->tinyInteger('type')->default(1);
            $table->decimal('value', 10, 2)->default(0);
            $table->date('book_from');
            $table->date('book_to');
            $table->date('reserve_from');
            $table->date('reserve_to');
            $table->integer('priority')->default(0);
            $table->boolean('is_active')->default(true);

            // Reserved for a future coupon code feature. While null, the discount
            // is applied automatically; a non-null code opts it out of auto-resolution.
            $table->string('code')->nullable()->unique();
            $table->integer('max_uses')->nullable();
            $table->integer('uses_count')->default(0);

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
        Schema::dropIfExists('discounts');
    }
};
