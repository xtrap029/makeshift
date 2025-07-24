<?php

namespace App\Console\Commands;

use App\Services\BookingStatusService;
use Illuminate\Console\Command;

class UpdateExpiredBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-expired-bookings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update expired bookings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        BookingStatusService::updateExpiredBookings();
    }
}
