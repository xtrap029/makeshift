<?php

use App\Http\Controllers\AmenityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LayoutController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentProviderController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ScheduleOverrideController;
use App\Http\Controllers\Settings\Email\AppearanceController as EmailAppearanceController;
use App\Http\Controllers\Settings\Website\AppearanceController as WebsiteAppearanceController;
use App\Http\Controllers\Settings\Website\LegalController;
use App\Http\Controllers\Unauth\ContactUsController;
use App\Http\Controllers\Unauth\HomeController;
use App\Http\Controllers\Unauth\ReservationController;
use App\Http\Controllers\Unauth\SpaceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/spaces', [SpaceController::class, 'index'])->name('spaces');
Route::get('/spaces/{space}', [SpaceController::class, 'show'])->name('spaces.show');
Route::get('/reservation/inquire/success', [ReservationController::class, 'inquireSuccess'])->name('reservation.inquire.success');
Route::get('/reservation/inquire/{roomName}', [ReservationController::class, 'inquire'])->name('reservation.inquire');
Route::post('/reservation/inquire/{roomName}', [ReservationController::class, 'inquireStore'])->name('reservation.inquire.post');
Route::get('/contact-us', [ContactUsController::class, 'index'])->name('contactus');
Route::post('/contact-us/resend', [ContactUsController::class, 'resend'])->name('contactus.resend');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('dashboard/verify', [DashboardController::class, 'verifyBooking'])->name('dashboard.verify');

    Route::resource('users', UserController::class);
    Route::resource('rooms', RoomController::class);
    Route::resource('amenities', AmenityController::class);
    Route::resource('layouts', LayoutController::class);
    Route::resource('schedules', ScheduleController::class);
    Route::resource('overrides', ScheduleOverrideController::class);
    Route::resource('payment-providers', PaymentProviderController::class)->names('paymentProviders');
    Route::resource('bookings', BookingController::class);
    Route::get('bookings-calendar', [BookingController::class, 'calendar'])->name('bookings.calendar');
    Route::put('bookings/{booking}/edit-status', [BookingController::class, 'updateStatus'])
        ->name('bookings.updateStatus');
    Route::get('bookings/{booking}/send-acknowledged-email', [BookingController::class, 'sendAcknowledgedEmail'])
        ->name('bookings.sendAcknowledgedEmail');
    Route::resource('payments', PaymentController::class);
    Route::get('logs/mail', [LogController::class, 'mail'])->name('logs.mail');

    Route::get('settings/website/appearance', [WebsiteAppearanceController::class, 'index'])->name('settings.website.appearance');
    Route::put('settings/website/appearance', [WebsiteAppearanceController::class, 'update'])->name('settings.website.appearance.update');

    Route::get('settings/email/appearance', [EmailAppearanceController::class, 'index'])->name('settings.email.appearance');
    Route::put('settings/email/appearance', [EmailAppearanceController::class, 'update'])->name('settings.email.appearance.update');

    Route::get('settings/website/legal', [LegalController::class, 'index'])->name('settings.website.legal');
    Route::put('settings/website/legal', [LegalController::class, 'update'])->name('settings.website.legal.update');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
