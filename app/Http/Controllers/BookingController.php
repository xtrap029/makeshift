<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Models\Booking;
use App\Models\Layout;
use App\Models\Room;
use App\Services\RoomAvailabilityService;
use Illuminate\Support\Facades\Mail;
use App\Mail\InquiryAcknowledged;
use App\Mail\InquiryConfirmed;
use App\Mail\InquiryCancelled;
use App\Services\BookingService;
use App\Services\VoucherService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\FilterBookingRequest;

class BookingController extends Controller
{
    protected $roomAvailabilityService;

    public function __construct(RoomAvailabilityService $roomAvailabilityService)
    {
        $this->roomAvailabilityService = $roomAvailabilityService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(FilterBookingRequest $request)
    {
        $filters = $request->validated();

        $bookings = Booking::with('room', 'layout')->orderBy('created_at', 'desc');

        if (isset($filters['date_from'])) {
            $bookings->where('start_date', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $bookings->where('start_date', '<=', $filters['date_to']);
        }

        if (isset($filters['rooms'])) {
            $bookings->whereIn('room_id', $filters['rooms']);
        }

        if (isset($filters['layouts'])) {
            $bookings->whereIn('layout_id', $filters['layouts']);
        }

        if (isset($filters['status'])) {
            $bookings->where('status', $filters['status']);
        }

        $bookings = $bookings->paginate(config('global.pagination_limit'))->withQueryString();

        return Inertia::render('booking/index', [
            'bookings' => $bookings,
            'rooms' => Room::orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
            'filters' => $filters,
        ]);
    }

    /**
     * Get bookings for calendar view (all bookings for specified month)
     */
    public function calendar(Request $request)
    {
        $month = (int) $request->get('month', now()->month);
        $year = (int) $request->get('year', now()->year);

        // Validate month and year
        $month = max(1, min(12, $month));
        $year = max(2020, min(2030, $year));

        // Use Carbon::create to avoid setMonth issues
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();

        $bookings = Booking::with('room', 'layout')
            ->where('start_date', '>=', $startDate)
            ->where('start_date', '<=', $endDate)
            ->orderBy('start_date')
            ->orderBy('start_time')
            ->get();

        return response()->json($bookings);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('booking/create', [
            'rooms' => Room::where('is_active', true)->orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        $validated = $request->validated();

        $validated['status'] = config('global.booking_status.inquiry')[0];

        $booking = Booking::create($validated);

        return to_route('bookings.show', $booking)->withSuccess('Booking created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        $booking->load('room', 'layout', 'owner', 'updater', 'payments.payment_provider');
        $booking->total_paid = $booking->total_paid();
        $booking->total_hours = $booking->total_hours();
        $booking->total_price = $booking->total_price();

        return Inertia::render('booking/show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        $booking->load('room', 'layout');

        return Inertia::render('booking/edit', [
            'booking' => $booking,
            'rooms' => Room::where('is_active', true)->orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        if (
            $booking->status !== config('global.booking_status.inquiry')[0]
            && $booking->status !== config('global.booking_status.pending')[0]
        ) {
            return back()->withError(config('messages.not_allowed'));
        }

        $validated = $request->validated();

        $booking->update($validated);

        return to_route('bookings.show', $booking)->withSuccess('Booking updated successfully!');
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking)
    {
        $validated = $request->validated();

        $failed_message = "Status update failed. ";

        switch ($validated['status']) {
            case 'pending':
                // Booking should be inquiry
                if ($booking->status !== config('global.booking_status.inquiry')[0]) {
                    return back()->withError($failed_message . ' Booking is not inquiry');
                }

                $availability = $this->roomAvailabilityService->verifyRoomAvailability($booking->room, $booking->qty, $booking->start_date, $booking->start_time, $booking->end_time);
                if (!$availability['status']) {
                    return back()->withError($failed_message . $availability['message']);
                }

                $booking->update([
                    'status' => config('global.booking_status.pending')[0]
                ]);
                break;
            case 'inquiry':
                // Booking should be pending
                if ($booking->status !== config('global.booking_status.pending')[0] && $booking->status !== config('global.booking_status.canceled')[0]) {
                    return back()->withError($failed_message . 'Booking is not pending or canceled');
                }

                $booking->update(['status' => config('global.booking_status.inquiry')[0], 'cancel_reason' => null]);
                break;
            case 'confirmed':
                // Booking should be pending
                if ($booking->status !== config('global.booking_status.pending')[0]) {
                    return back()->withError($failed_message . 'Booking is not pending');
                }

                // Total paid should be equal or greater than total price
                if ($booking->total_paid() < $booking->total_price()) {
                    return back()->withError($failed_message . 'Total paid is less than total price');
                }

                $voucherCode = VoucherService::generate();

                $booking->update([
                    'status' => config('global.booking_status.confirmed')[0],
                    'voucher_code' => $voucherCode,
                ]);

                Mail::to($booking->customer_email)->send(new InquiryConfirmed([
                    'name' => $booking->customer_name,
                    'booking_id' => BookingService::generateBookingId($booking),
                    'booking_date' => $booking->start_date,
                    'booking_time' => $booking->start_time . ' - ' . $booking->end_time,
                    'booking_room' => $booking->room->name . ' (' . $booking->layout->name . ')',
                    'booking_note' => $booking->note,
                    'booking_room_price' => 'PHP ' . number_format($booking->room->price, 2, '.', ','),
                    'booking_total_hours' => $booking->total_hours(),
                    'booking_total_price' => 'PHP ' . number_format($booking->total_price(), 2, '.', ','),
                    'voucher_code' => $voucherCode,
                    'qr_code' => asset('storage/vouchers/' . $voucherCode . '.png'),
                ]));

                $booking->update([
                    'voucher_sent_at' => now(),
                ]);

                break;
            case 'canceled':
                // Booking should be pending
                if ($booking->status !== config('global.booking_status.pending')[0]) {
                    return back()->withError($failed_message . 'Booking is not pending');
                }

                $booking->update([
                    'status' => config('global.booking_status.canceled')[0],
                    'cancel_reason' => $validated['cancel_reason'],
                ]);

                Mail::to($booking->customer_email)->send(new InquiryCancelled([
                    'name' => $booking->customer_name,
                    'booking_id' => BookingService::generateBookingId($booking),
                    'cancellation_reason' => $booking->cancellation_reason ?? 'Payment deadline exceeded or space unavailability',
                ]));
                break;
            default:
                return back()->withError($failed_message . 'Invalid status');
        }

        $booking->update(['expires_at' => null]);

        return to_route('bookings.show', $booking)->withSuccess('Booking status updated successfully!');
    }

    public function sendAcknowledgedEmail(Booking $booking)
    {
        if ($booking->status !== config('global.booking_status.pending')[0]) {
            return back()->withError('Booking is not pending');
        }

        Mail::to($booking->customer_email)->send(new InquiryAcknowledged([
            'name' => $booking->customer_name,
            'payment_method' => 'Bank Transfer',
            'account_details' => null,
            'amount' => 'PHP ' . number_format($booking->total_price(), 2, '.', ','),
            'deadline' => $booking->expires_at,
            'booking_id' => BookingService::generateBookingId($booking),
            'booking_room' => $booking->room->name . ' (' . $booking->layout->name . ')',
            'booking_date' => $booking->start_date,
            'booking_time' => $booking->start_time . ' - ' . $booking->end_time,
            'booking_note' => $booking->note,
            'booking_room_price' => 'PHP ' . number_format($booking->room->price, 2, '.', ','),
            'booking_total_hours' => $booking->total_hours(),
            'booking_total_price' => 'PHP ' . number_format($booking->total_price(), 2, '.', ','),
        ]));

        return back()->withSuccess('Acknowledged email sent successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        if ($booking->status !== config('global.booking_status.inquiry')[0]) {
            return back()->withError(config('messages.not_allowed'));
        }

        $booking->delete();

        Mail::to($booking->customer_email)->send(new InquiryCancelled([
            'name' => $booking->customer_name,
            'booking_id' => BookingService::generateBookingId($booking),
            'cancellation_reason' => 'Inquiry deleted. Space unavailable for selected date and time.',
        ]));

        return to_route('bookings.index')->withSuccess('Booking deleted successfully!');
    }
}
