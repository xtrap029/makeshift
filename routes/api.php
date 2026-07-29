<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\Unauth\RoomCalendarController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('/api/bookings/verify', [BookingController::class, 'verify']);
    Route::get('/api/bookings/{booking}/preview-discount', [BookingController::class, 'previewDiscount']);
    Route::post('/api/rooms/{roomId}/images', [RoomController::class, 'images']);
    Route::post('/api/announcements/images', [AnnouncementController::class, 'images']);
});

// Public — no auth. Powers the fare-style date picker on a room's public page.
Route::get('/api/spaces/{roomName}/rate-calendar', [RoomCalendarController::class, 'index']);

Route::get('/cron/run/{token}', function ($token) {
    abort_unless($token === config('app.cron_token'), 403);

    $exitCode = Artisan::call('schedule:run');

    return response()->json([
        'status' => $exitCode === 0 ? 'success' : 'error',
    ]);
});
