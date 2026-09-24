<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterVoucherRequest;
use App\Http\Requests\StoreVoucherRequest;
use App\Http\Requests\UpdateVoucherRequest;
use App\Models\Room;
use App\Models\Voucher;
use Inertia\Inertia;

/**
 * Customer-selectable offers. Mirrors DiscountController, minus the overlap
 * badging — vouchers stack rather than compete, so there is no priority contest
 * between them to warn staff about.
 */
class VoucherController extends Controller
{
    public function index(FilterVoucherRequest $request)
    {
        $filters = $request->validated();

        $vouchers = Voucher::query()
            ->with('rooms:id,name')
            ->orderBy('priority', 'asc')
            ->orderBy('name');

        if (isset($filters['name'])) {
            $vouchers->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (isset($filters['type'])) {
            $vouchers->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $vouchers->where('is_active', $filters['status']);
        }

        if (!empty($filters['rooms'])) {
            $vouchers->whereHas('rooms', function ($query) use ($filters) {
                $query->whereIn('rooms.id', $filters['rooms']);
            });
        }

        $vouchers = $vouchers
            ->paginate(config('global.pagination_limit'))
            ->withQueryString();

        return Inertia::render('voucher/index', [
            'vouchers' => $vouchers,
            'rooms' => Room::orderBy('name')->get(['id', 'name']),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('voucher/create', [
            'rooms' => Room::orderBy('name')->get(['id', 'name', 'price']),
        ]);
    }

    public function store(StoreVoucherRequest $request)
    {
        $validated = $request->validated();

        $voucher = Voucher::create($validated);
        $voucher->rooms()->sync($validated['rooms']);

        return to_route('vouchers.index')->withSuccess('Voucher created successfully!');
    }

    public function show(Voucher $voucher)
    {
        return to_route('vouchers.edit', $voucher);
    }

    public function edit(Voucher $voucher)
    {
        $voucher->load('rooms:id,name');

        return Inertia::render('voucher/edit', [
            'voucher' => $voucher,
            'rooms' => Room::orderBy('name')->get(['id', 'name', 'price']),
        ]);
    }

    public function update(UpdateVoucherRequest $request, Voucher $voucher)
    {
        $validated = $request->validated();

        $voucher->update($validated);
        $voucher->rooms()->sync($validated['rooms']);

        return to_route('vouchers.index')->withSuccess('Voucher updated successfully!');
    }

    /**
     * Soft delete only — bookings keep their own frozen snapshot, so already
     * claimed vouchers are unaffected.
     */
    public function destroy(Voucher $voucher)
    {
        $voucher->delete();

        return to_route('vouchers.index')->withSuccess('Voucher deleted successfully!');
    }
}
