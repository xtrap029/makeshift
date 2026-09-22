<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Http\Requests\RescheduleBookingRequest;
use App\Models\Booking;
use App\Models\Layout;
use App\Models\Room;
use App\Models\Source;
use App\Services\RoomAvailabilityService;
use Illuminate\Support\Facades\Mail;
use App\Mail\InquiryAcknowledged;
use App\Mail\InquiryConfirmed;
use App\Mail\InquiryCancelled;
use App\Mail\BookingRescheduled;
use App\Services\BookingService;
use App\Services\DiscountService;
use App\Services\VoucherService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $bookings = Booking::with('room', 'layout', 'source')->orderBy('created_at', 'desc');

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

        $bookings = Booking::with('room', 'layout', 'source')
            ->where('start_date', '>=', $startDate)
            ->where('start_date', '<=', $endDate);

        if ($request->filled('date_from')) {
            $bookings->where('start_date', '>=', $request->get('date_from'));
        }

        if ($request->filled('date_to')) {
            $bookings->where('start_date', '<=', $request->get('date_to'));
        }

        if ($request->filled('rooms')) {
            $bookings->whereIn('room_id', (array) $request->get('rooms'));
        }

        if ($request->filled('layouts')) {
            $bookings->whereIn('layout_id', (array) $request->get('layouts'));
        }

        if ($request->filled('status')) {
            $bookings->where('status', $request->get('status'));
        }

        return response()->json(
            $bookings->orderBy('start_date')->orderBy('start_time')->get()
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('booking/create', [
            'rooms' => Room::where('is_active', true)->orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
            'sources' => Source::orderBy('name')->get(),
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

        DiscountService::applyTo($booking);

        return to_route('bookings.show', $booking)->withSuccess('Booking created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        $booking->load('room', 'layout', 'source', 'owner', 'updater', 'payments.payment_provider', 'discounts');
        $booking->total_paid = $booking->total_paid();
        $booking->total_hours = $booking->total_hours();
        $booking->subtotal = $booking->subtotal();
        $booking->discount_amount = $booking->discount_amount();
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
        $booking->load('room', 'layout', 'source');

        return Inertia::render('booking/edit', [
            'booking' => $booking,
            'rooms' => Room::where('is_active', true)->orderBy('name')->get(),
            'layouts' => Layout::orderBy('name')->get(),
            'sources' => Source::orderBy('name')->get(),
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
     * Re-resolve and rewrite the booking's discount snapshot on demand.
     *
     * Not run automatically on every edit — an unrelated field change (a note, a
     * phone number) shouldn't silently move the price on a booking that may already
     * have payments recorded against it. Staff trigger this explicitly after
     * changing room/date/time/qty and wanting the total to reflect it.
     */
    public function recalculateDiscount(Booking $booking)
    {
        if (
            $booking->status !== config('global.booking_status.inquiry')[0]
            && $booking->status !== config('global.booking_status.pending')[0]
        ) {
            return back()->withError(config('messages.not_allowed'));
        }

        DiscountService::applyTo($booking);

        return back()->withSuccess('Discount recalculated successfully!');
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
                    'status' => config('global.booking_status.pending')[0],
                    'expires_at' => $validated['expires_at'] ?? null,
                ]);

                if (!empty($validated['notify'])) {
                    $this->sendAcknowledgedMail($booking->fresh(['room', 'layout']));

                    return to_route('bookings.show', $booking)->withSuccess('Booking set to pending and customer notified!');
                }

                return to_route('bookings.show', $booking)->withSuccess('Booking set to pending!');
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
                    ...DiscountService::mailData($booking),
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

    /**
     * Move a Confirmed (paid) booking to a new date/time in the same room.
     *
     * The end time is derived from the original duration and the discount snapshot
     * is left untouched, so the customer's locked total never changes. Every
     * reschedule appends a line to `note`, which doubles as the change log.
     */
    public function reschedule(RescheduleBookingRequest $request, Booking $booking)
    {
        if ($booking->status !== config('global.booking_status.confirmed')[0]) {
            return back()->withError(config('messages.not_allowed'));
        }

        $validated = $request->validated();
        $failed_message = 'Reschedule failed. ';

        $booking->load('room', 'layout');

        $hours = (int) $booking->total_hours();
        $newStart = Carbon::createFromFormat('H:i:s', $validated['start_time']);
        $newEnd = $newStart->copy()->addHours($hours);

        if ($newEnd->day !== $newStart->day) {
            return back()->withError($failed_message . 'Selected start time does not leave enough hours in the day');
        }

        $availability = $this->roomAvailabilityService->verifyRoomAvailability(
            $booking->room,
            $booking->qty,
            $validated['start_date'],
            $newStart->format('H:i:s'),
            $newEnd->format('H:i:s'),
            $booking->id
        );
        if (!$availability['status']) {
            return back()->withError($failed_message . $availability['message']);
        }

        $previousDate = Carbon::parse($booking->start_date)->format('M d, Y');
        $previousTime = substr($booking->start_time, 0, 5) . ' - ' . substr($booking->end_time, 0, 5);
        $newDate = Carbon::parse($validated['start_date'])->format('M d, Y');
        $newTime = $newStart->format('H:i') . ' - ' . $newEnd->format('H:i');

        $logLine = sprintf(
            '[%s by %s] Rescheduled from %s %s to %s %s.',
            now()->format('Y-m-d H:i'),
            Auth::user()?->name ?? 'System',
            $previousDate,
            $previousTime,
            $newDate,
            $newTime
        );
        if (!empty($validated['note'])) {
            $logLine .= ' ' . trim($validated['note']);
        }

        $booking->update([
            'start_date' => $validated['start_date'],
            'start_time' => $newStart->format('H:i:s'),
            'end_time' => $newEnd->format('H:i:s'),
            'note' => trim(($booking->note ? $booking->note . "\n" : '') . $logLine),
        ]);

        Mail::to($booking->customer_email)->send(new BookingRescheduled([
            'name' => $booking->customer_name,
            'booking_id' => BookingService::generateBookingId($booking),
            'previous_date' => $previousDate,
            'previous_time' => $previousTime,
            'booking_date' => $booking->start_date,
            'booking_time' => $booking->start_time . ' - ' . $booking->end_time,
            'booking_room' => $booking->room->name . ' (' . $booking->layout->name . ')',
            'booking_note' => $booking->note,
            'reschedule_note' => $validated['note'] ?? null,
            'booking_room_price' => 'PHP ' . number_format($booking->room->price, 2, '.', ','),
            'booking_total_hours' => $booking->total_hours(),
            'booking_total_price' => 'PHP ' . number_format($booking->total_price(), 2, '.', ','),
            ...DiscountService::mailData($booking),
            'voucher_code' => $booking->voucher_code,
            'qr_code' => asset('storage/vouchers/' . $booking->voucher_code . '.png'),
        ]));

        return to_route('bookings.show', $booking)->withSuccess('Booking rescheduled successfully!');
    }

    public function sendAcknowledgedEmail(Booking $booking)
    {
        if ($booking->status !== config('global.booking_status.pending')[0]) {
            return back()->withError('Booking is not pending');
        }

        $this->sendAcknowledgedMail($booking);

        return back()->withSuccess('Acknowledged email sent successfully!');
    }

    /**
     * Payment-request email for a Pending booking. Shared by the explicit Notify
     * button and the "Set as Pending & Notify" option on the status change.
     */
    private function sendAcknowledgedMail(Booking $booking): void
    {
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
            ...DiscountService::mailData($booking),
        ]));
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
