<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\PaymentProvider;
use App\Models\Room;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Requests\FilterPaymentRequest;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(FilterPaymentRequest $request)
    {
        $filters = $request->validated();

        $payments = Payment::with('booking.room', 'payment_provider')->orderBy('created_at', 'desc');

        if (isset($filters['date_from'])) {
            $payments->where('paid_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $payments->where('paid_at', '<=', $filters['date_to']);
        }

        if (isset($filters['rooms'])) {
            $payments->whereIn('booking_id', Booking::whereIn('room_id', $filters['rooms'])->pluck('id'));
        }

        if (isset($filters['status'])) {
            $payments->where('status', $filters['status']);
        }

        if (isset($filters['reference_number'])) {
            $payments->where('reference_number', 'like', '%' . $filters['reference_number'] . '%');
        }

        if (isset($filters['note'])) {
            $payments->where('note', 'like', '%' . $filters['note'] . '%');
        }

        $payments = $payments->paginate(config('global.pagination_limit'))->withQueryString();

        return Inertia::render('payment/index', [
            'payments' => $payments,
            'rooms' => Room::orderBy('name')->get(),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('payment/create', [
            'bookings' => Booking::with('room')->whereIn('status', [
                config('global.booking_status.pending')[0],
            ])->get(),
            'payment_providers' => PaymentProvider::where('is_active', true)->orderBy('name', 'asc')->get(),
            'booking_id' => request('booking-id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
    {
        $validated = $request->validated();

        $booking = Booking::find($validated['booking_id']);
        if ($booking->status !== config('global.booking_status.pending')[0]) {
            return back()->withError('Booking is not pending');
        }

        $validated['status'] = config('global.payment_status.pending')[0];

        if (isset($validated['attachment']) && $validated['with_attachment'] == 1) {
            $validated['attachment'] = $validated['attachment']->store('payments', 'public');
        } else {
            unset($validated['attachment']);
        }

        $payment = Payment::create($validated);

        return to_route('payments.show', $payment)->withSuccess('Payment created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load('booking.room', 'payment_provider', 'owner', 'updater');

        return Inertia::render('payment/show', [
            'payment' => $payment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        $payment->load('booking.room', 'payment_provider');

        return Inertia::render('payment/edit', [
            'payment' => $payment,
            'bookings' => Booking::with('room')->whereIn('status', [
                config('global.booking_status.pending')[0],
            ])->get(),
            'payment_providers' => PaymentProvider::where('is_active', true)->orderBy('name', 'asc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $validated = $request->validated();

        $booking = Booking::find($validated['booking_id']);
        if (
            $booking->status !== config('global.booking_status.pending')[0]
            && $payment->booking->status !== config('global.booking_status.pending')[0]
        ) {
            return back()->withError('Booking is not pending');
        }

        if ($validated['with_attachment'] == 1 && !$validated['attachment'] && $payment->attachment == null) {
            return back()->withError('Attachment is required');
        }

        if (isset($validated['attachment']) && $validated['with_attachment'] == 1) {
            $validated['attachment'] = $validated['attachment']->store('payments', 'public');
        } else if ($validated['with_attachment'] == 0 && $payment->attachment) {
            Storage::disk('public')->delete($payment->attachment);
            $validated['attachment'] = null;
        } else {
            unset($validated['attachment']);
        }

        $payment->update($validated);

        return to_route('payments.show', $payment)->withSuccess('Payment updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        if (!in_array($payment->booking->status, [
            config('global.booking_status.inquiry')[0],
            config('global.booking_status.pending')[0],
            config('global.booking_status.canceled')[0]
        ])) {
            return back()->withError(config('messages.not_allowed'));
        }

        $payment->delete();

        return to_route('payments.index')->withSuccess('Payment deleted successfully!');
    }
}
