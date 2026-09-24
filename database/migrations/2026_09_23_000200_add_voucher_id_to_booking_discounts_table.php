<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * booking_discounts doubles as the single deductions ledger for a booking:
     * automatic discount rows (source 1) and customer-selected voucher rows
     * (source 3) live side by side, and Booking::total_price() sums them all.
     */
    public function up(): void
    {
        Schema::table('booking_discounts', function (Blueprint $table) {
            $table->foreignId('voucher_id')->nullable()->after('discount_id')
                ->constrained('vouchers')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('booking_discounts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('voucher_id');
        });
    }
};
