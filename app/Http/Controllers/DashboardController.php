<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $todaysBookings = Booking::with('room', 'layout')
            ->where('start_date', now()->format('Y-m-d'))
            ->whereIn('status', [config('global.booking_status.pending')[0], config('global.booking_status.confirmed')[0]])
            ->orderBy('start_time', 'asc')
            ->paginate(config('global.pagination_limit'));

        $todaysBookings->each(function ($booking) {
            $booking->total_hours = $booking->total_hours();
        });

        $lastLoginUsers = User::whereNotNull('login_at')->orderBy('login_at', 'desc')->limit(5)->get();
        $lastLoginUsers->each(function ($user) {
            $user->login_at = $user->login_at ? Carbon::parse($user->login_at)->diffForHumans() : '-';
        });

        $latestBookings = Booking::orderBy('created_at', 'desc')->limit(5)->get();
        $latestBookings->each(function ($booking) {
            $booking->created_at_formatted = $booking->created_at ? Carbon::parse($booking->created_at)->diffForHumans() : '-';
        });

        return Inertia::render('dashboard', [
            'todaysBookings' => $todaysBookings,
            'lastLoginUsers' => $lastLoginUsers,
            'latestBookings' => $latestBookings,
        ]);
    }
}
