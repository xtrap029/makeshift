<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A single manual, staff-entered adjustment to the booking total. Kept as
     * columns rather than a booking_discounts row: a surcharge isn't a discount,
     * and the room-change hook clears booking_discounts — an adjustment is a flat
     * amount staff chose, so it must survive that.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Signed: positive raises the total, negative lowers it.
            $table->decimal('adjustment_amount', 10, 2)->nullable()->after('source_id');
            $table->string('adjustment_reason')->nullable()->after('adjustment_amount');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['adjustment_amount', 'adjustment_reason']);
        });
    }
};
