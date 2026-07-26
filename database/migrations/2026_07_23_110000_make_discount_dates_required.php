<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Both date windows are now mandatory. Existing rows with open-ended bounds
     * are backfilled: "from" falls back to when the discount was created, "to"
     * falls back to a far-future sentinel so behaviour is unchanged.
     */
    public function up(): void
    {
        DB::table('discounts')->whereNull('reserve_from')
            ->update(['reserve_from' => DB::raw('DATE(created_at)')]);
        DB::table('discounts')->whereNull('reserve_to')
            ->update(['reserve_to' => '2099-12-31']);
        DB::table('discounts')->whereNull('book_from')
            ->update(['book_from' => DB::raw('DATE(created_at)')]);
        DB::table('discounts')->whereNull('book_to')
            ->update(['book_to' => '2099-12-31']);

        Schema::table('discounts', function (Blueprint $table) {
            $table->date('book_from')->nullable(false)->change();
            $table->date('book_to')->nullable(false)->change();
            $table->date('reserve_from')->nullable(false)->change();
            $table->date('reserve_to')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discounts', function (Blueprint $table) {
            $table->date('book_from')->nullable()->change();
            $table->date('book_to')->nullable()->change();
            $table->date('reserve_from')->nullable()->change();
            $table->date('reserve_to')->nullable()->change();
        });
    }
};
