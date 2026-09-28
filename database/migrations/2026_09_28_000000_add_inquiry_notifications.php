<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Browser notifications for new inquiries: when each user last opened the
     * Bookings page (anything newer is "unseen"), plus an index for the unseen
     * count, which every open admin tab polls twice a minute.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('inquiries_seen_at')->nullable();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'bookings_status_created_at_index');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('bookings_status_created_at_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('inquiries_seen_at');
        });
    }
};
