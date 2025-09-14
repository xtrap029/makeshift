<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Http\Requests\UpdatePaymentStatusRequest;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\PaymentProvider;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('payment/index', [
            'payments' => Payment::with('booking.room', 'payment_provider')->orderBy('created_at', 'desc')->paginate(config('global.pagination_limit')),
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
