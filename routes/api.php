<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('/api/bookings/verify', [BookingController::class, 'verify']);
    Route::post('/api/rooms/{roomId}/images', [RoomController::class, 'images']);
});

Route::get('/cron/run/{token}', function ($token) {
    abort_unless($token === config('app.cron_token'), 403);

    $exitCode = Artisan::call('schedule:run');

    return response()->json([
        'status' => $exitCode === 0 ? 'success' : 'error',
    ]);
});
