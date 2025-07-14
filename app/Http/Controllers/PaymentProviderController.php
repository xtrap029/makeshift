<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentProviderRequest;
use App\Http\Requests\UpdatePaymentProviderRequest;
use App\Models\PaymentProvider;
use Inertia\Inertia;

class PaymentProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('paymentProvider/index', [
            'paymentProviders' => PaymentProvider::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('paymentProvider/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentProviderRequest $request)
    {
        $validated = $request->validated();

        if ($validated['is_default']) {
            PaymentProvider::query()->update(['is_default' => false]);
        }

        PaymentProvider::create($validated);


        return to_route('paymentProviders.index')->withSuccess('Payment provider created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentProvider $paymentProvider)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentProvider $paymentProvider)
    {
        return Inertia::render('paymentProvider/edit', [
            'paymentProvider' => $paymentProvider,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentProviderRequest $request, PaymentProvider $paymentProvider)
    {
        $validated = $request->validated();

        if ($validated['is_default']) {
            PaymentProvider::where('id', '!=', $paymentProvider->id)->update(['is_default' => false]);
        }

        $paymentProvider->update($validated);

        return to_route('paymentProviders.index')->withSuccess('Payment provider updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentProvider $paymentProvider)
    {
        $paymentProvider->delete();

        return to_route('paymentProviders.index')->withSuccess('Payment provider deleted successfully!');
    }
}
