<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\LayoutController;
use App\Http\Controllers\PaymentProviderController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ScheduleOverrideController;
use App\Http\Controllers\PaymentController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

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
