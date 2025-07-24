<?php

use App\Console\Commands\UpdateExpiredBookings;
use Illuminate\Support\Facades\Schedule;

Schedule::command(UpdateExpiredBookings::class)->everyMinute();
