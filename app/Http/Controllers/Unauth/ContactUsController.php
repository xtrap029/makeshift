<?php

namespace App\Http\Controllers\Unauth;

use App\Http\Controllers\Controller;
use App\Mail\InquiryResend;
use App\Models\Booking;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactUsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Settings::whereIn('key', ['SITE_EMAIL', 'SITE_PHONE'])->pluck('value', 'key');
        return Inertia::render('unauth/contactUs/index', [
            'contact' => [
                'siteEmail' => $data['SITE_EMAIL'] ?? null,
                'sitePhone' => $data['SITE_PHONE'] ?? null,
            ],
        ]);
    }

    /**
     * Resend reservations and inquiries.
     */
    public function resend(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        try {

            $bookings = Booking::with('room')
                ->where('customer_email', $validated['email'])
                ->whereIn('status', config('global.booking_status.confirmed'))
                ->get()
                ->each(function ($booking) {
                    $booking->total_price = 'PHP ' . number_format($booking->total_price(), 2, '.', ',');
                });

            Mail::to($validated['email'])->send(new InquiryResend([
                'name' => $bookings->first()->customer_name,
                'bookings' => $bookings,
            ]));

            return to_route('contactus')->withSuccess('Reservations sent successfully!');
        } catch (\Exception $e) {
            return back()->withError('Failed to resend reservations');
        }
    }
}
