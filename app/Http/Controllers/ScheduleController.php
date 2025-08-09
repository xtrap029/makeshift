<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Models\Room;
use App\Models\Schedule;
use Inertia\Inertia;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schedules = Schedule::orderBy('name')->paginate(config('global.pagination_limit'));
        foreach ($schedules as $schedule) {
            $schedule->max_date = Carbon::parse($schedule->max_date)->diffForHumans();
        }
        return Inertia::render('schedule/index', [
            'schedules' => $schedules,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('schedule/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreScheduleRequest $request)
    {
        $validated = $request->validated();
        Schedule::create($validated);

        return to_route('schedules.index')->withSuccess('Schedule created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('schedule/edit', [
            'schedule' => Schedule::find($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        $validated = $request->validated();
        $schedule->update($validated);

        return to_route('schedules.index')->withSuccess('Schedule updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $schedule = Schedule::find($id);
        Room::where('schedule_id', $schedule->id)->update(['schedule_id' => null]);
        $schedule->delete();

        return to_route('schedules.index')->withSuccess('Schedule deleted successfully!');
    }
}
