<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Unauth\HomeController;
use App\Http\Controllers\Unauth\SpaceController;
use App\Http\Controllers\LayoutController;
use App\Http\Controllers\PaymentProviderController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ScheduleOverrideController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReservationController;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/spaces', [SpaceController::class, 'index'])->name('spaces');
Route::get('/spaces/{space}', [SpaceController::class, 'show'])->name('spaces.show');
Route::get('/reservation/inquire/{roomName}', [ReservationController::class, 'inquire'])->name('reservation.inquire');
Route::post('/reservation/inquire/{roomName}', [ReservationController::class, 'inquirePost'])->name('reservation.inquire.post');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('rooms', RoomController::class);
    Route::resource('amenities', AmenityController::class);
    Route::resource('layouts', LayoutController::class);
    Route::resource('schedules', ScheduleController::class);
    Route::resource('overrides', ScheduleOverrideController::class);
    Route::resource('payment-providers', PaymentProviderController::class)->names('paymentProviders');
    Route::resource('bookings', BookingController::class);
    Route::put('bookings/{booking}/edit-status', [BookingController::class, 'updateStatus'])
        ->name('bookings.updateStatus');
    Route::resource('payments', PaymentController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
