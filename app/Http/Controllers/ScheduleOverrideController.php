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
    public function index()
    {
        return Inertia::render('scheduleOverride/index', [
            'scheduleOverrides' => ScheduleOverride::all(),
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
    public function destroy(ScheduleOverride $scheduleOverride)
    {
        //
    }
}
