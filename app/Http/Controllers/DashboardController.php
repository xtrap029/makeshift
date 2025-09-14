<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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

        return Inertia::render('dashboard', [
            'todaysBookings' => $todaysBookings,
        ]);
    }
}
