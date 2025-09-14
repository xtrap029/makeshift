<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookingController;

Route::middleware('auth')->group(function () {
    Route::post('/api/bookings/verify', [BookingController::class, 'verify']);
});
