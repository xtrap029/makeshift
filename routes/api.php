<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;

Route::middleware('auth')->group(function () {
    Route::post('/api/bookings/verify', [BookingController::class, 'verify']);
    Route::post('/api/rooms/{roomId}/images', [RoomController::class, 'images']);
});
