<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterDiscountRequest;
use App\Http\Requests\StoreDiscountRequest;
use App\Http\Requests\UpdateDiscountRequest;
use App\Models\Discount;
use App\Models\Room;
use App\Services\DiscountService;
use Inertia\Inertia;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(FilterDiscountRequest $request)
    {
        $filters = $request->validated();

        $discounts = Discount::query()
            ->with('rooms:id,name')
            ->orderBy('priority', 'asc')
            ->orderBy('name');

        if (isset($filters['name'])) {
            $discounts->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (isset($filters['type'])) {
            $discounts->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $discounts->where('is_active', $filters['status']);
        }

        if (!empty($filters['rooms'])) {
            $discounts->whereHas('rooms', function ($query) use ($filters) {
                $query->whereIn('rooms.id', $filters['rooms']);
            });
        }

        $discounts = $discounts
            ->paginate(config('global.pagination_limit'))
            ->withQueryString();

        // Advisory only — overlaps are allowed, priority decides the winner.
        $discounts->getCollection()->transform(function ($discount) {
            $discount->overlaps = DiscountService::overlaps($discount)->pluck('name');
            return $discount;
        });

        return Inertia::render('discount/index', [
            'discounts' => $discounts,
            'rooms' => Room::orderBy('name')->get(['id', 'name']),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('discount/create', [
            'rooms' => Room::orderBy('name')->get(['id', 'name', 'price']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDiscountRequest $request)
    {
        $validated = $request->validated();

        $discount = Discount::create($validated);
        $discount->rooms()->sync($validated['rooms']);

        return to_route('discounts.index')->withSuccess('Discount created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Discount $discount)
    {
        return to_route('discounts.edit', $discount);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discount $discount)
    {
        $discount->load('rooms:id,name');

        return Inertia::render('discount/edit', [
            'discount' => $discount,
            'rooms' => Room::orderBy('name')->get(['id', 'name', 'price']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDiscountRequest $request, Discount $discount)
    {
        $validated = $request->validated();

        $discount->update($validated);
        $discount->rooms()->sync($validated['rooms']);

        return to_route('discounts.index')->withSuccess('Discount updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * Soft delete only — bookings keep their own frozen snapshot, so already
     * submitted bookings are unaffected.
     */
    public function destroy(Discount $discount)
    {
        $discount->delete();

        return to_route('discounts.index')->withSuccess('Discount deleted successfully!');
    }
}
