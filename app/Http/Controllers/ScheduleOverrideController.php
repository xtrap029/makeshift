<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleOverrideRequest;
use App\Http\Requests\UpdateScheduleOverrideRequest;
use App\Models\Room;
use App\Models\ScheduleOverride;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleOverrideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['status', 'date_from', 'date_to', 'note']);

        $query = ScheduleOverride::with('rooms')->orderBy('date', 'desc');

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('is_open', $filters['status'] === '1');
        }
        if (!empty($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }
        if (!empty($filters['note'])) {
            $query->where('note', 'like', '%' . $filters['note'] . '%');
        }

        return Inertia::render('scheduleOverride/index', [
            'scheduleOverrides' => $query->paginate(config('global.pagination_limit'))->withQueryString(),
            'calendarOverrides' => ScheduleOverride::with('rooms')->orderBy('date', 'desc')->get(),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('scheduleOverride/create', [
            'rooms' => Room::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreScheduleOverrideRequest $request)
    {
        $validated = $request->validated();

        $override = ScheduleOverride::create($validated);

        if (isset($validated['rooms'])) {
            $override->rooms()->attach($validated['rooms']);
        }

        return to_route('overrides.index')->withSuccess('Override created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(ScheduleOverride $scheduleOverride)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScheduleOverride $override)
    {
        $override->load('rooms');

        return Inertia::render('scheduleOverride/edit', [
            'rooms' => Room::orderBy('name')->get(),
            'scheduleOverride' => $override,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateScheduleOverrideRequest $request, ScheduleOverride $override)
    {
        $validated = $request->validated();

        $override->update($validated);

        if (isset($validated['rooms'])) {
            $override->rooms()->sync($validated['rooms']);
        }

        return to_route('overrides.index')->withSuccess('Override updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScheduleOverride $override)
    {
        $override->rooms()->detach();
        $override->delete();

        return to_route('overrides.index')->withSuccess('Override deleted successfully!');
    }
}
