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
        $data = Settings::whereIn('key', [
            'SITE_EMAIL',
            'SITE_PHONE',
            'OFFICE_ADDRESS',
            'OFFICE_GOOGLE_MAP',
        ])->pluck('value', 'key');

        return Inertia::render('unauth/contactUs/index', [
            'contact' => [
                'siteEmail' => $data['SITE_EMAIL'] ?? null,
                'sitePhone' => $data['SITE_PHONE'] ?? null,
                'siteAddress' => $data['OFFICE_ADDRESS'] ?? null,
                'siteGoogleMap' => $data['OFFICE_GOOGLE_MAP'] ?? null,
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

        $bookings = Booking::with('room')
            ->where('customer_email', $validated['email'])
            ->whereIn('status', config('global.booking_status.confirmed'))
            ->get()
            ->each(function ($booking) {
                $booking->total_price = 'PHP '.number_format($booking->total_price(), 2, '.', ',');
            });

        if ($bookings->isNotEmpty()) {
            try {
                Mail::to($validated['email'])->send(new InquiryResend([
                    'name' => $bookings->first()->customer_name,
                    'bookings' => $bookings,
                ]));
            } catch (\Exception $e) {
                // Log::error($e->getMessage());
            }
        }

        return to_route('contactus')->withSuccess('Reservations sent successfully!');
    }
}
