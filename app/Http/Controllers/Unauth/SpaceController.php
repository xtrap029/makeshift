<?php

namespace App\Http\Controllers\Unauth;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\ScheduleOverride;
use App\Models\ScheduleOverrideRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SpaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'nullable|date|after:' . now()->format('Y-m-d'),
        ]);

        if ($validator->fails()) {
            return Inertia::render('unauth/space/index', [
                'rooms' => [],
                'error' => $request->error,
            ]);
        }

        $rooms = Room::select('id', 'name', 'cap', 'sqm', 'description')
            ->where('is_active', true)
            ->where('qty', '>', 0);

        if ($request->date) {
            $dateDay = strtolower(date('D', strtotime($request->date)));
            $rooms = $rooms->where(function ($query) use ($dateDay, $request) {
                $query
                    // Include: Has valid schedule
                    ->whereHas('schedule', function ($subQuery) use ($dateDay, $request) {
                        $subQuery->whereNotNull($dateDay . '_start')
                            ->whereNotNull($dateDay . '_end')
                            ->where('is_active', true)
                            ->where('max_day', '>=', now()->diffInDays($request->date))
                            ->where('max_date', '>=', $request->date);
                    });
            })->orWhere(function ($query) use ($request) {
                // Include: No schedule, but override is open
                $query->whereHas('scheduleOverrideRooms', function ($subQuery) use ($request) {
                    $subQuery->whereHas('scheduleOverride', function ($q) use ($request) {
                        $q->where('date', $request->date)
                            ->where('is_open', true);
                    });
                });
            });
        }

        $rooms = $rooms->with(['image' => function ($query) {
            $query->select('name', 'room_id')->where('is_main', true);
        }])->get();

        return Inertia::render('unauth/space/index', [
            'rooms' => $rooms,
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $name, Request $request)
    {
        $room = Room::select('id', 'name', 'cap', 'sqm', 'description', 'price', 'schedule_id', 'qty')
            ->where('is_active', true)
            ->where('qty', '>', 0)
            ->where('name', $name)
            ->with(['image' => function ($query) {
                $query->select('name', 'room_id')->where('is_main', true);
            }])
            ->with(['layouts' => function ($query) {
                $query->select('name', 'room_id');
            }])
            ->with(['amenities' => function ($query) {
                $query->select('name', 'icon', 'room_id');
            }])
            ->firstOrFail();

        $availableTimes = [];
        if ($room && $request->date) {
            // check if has schedule
            $dateDay = strtolower(date('D', strtotime($request->date)));
            $roomSchedule = Schedule::select($dateDay . '_start as start', $dateDay . '_end as end')
                ->where('id', $room->schedule_id)
                ->where($dateDay . '_start', '!=', null)
                ->where($dateDay . '_end', '!=', null)
                ->where('is_active', true)
                ->where('max_day', '>=', now()->diffInDays($request->date))
                ->where('max_date', '>=', $request->date)
                ->first();
            if ($roomSchedule) {
                $availableTimes = getHours($roomSchedule->start, $roomSchedule->end);
            }

            // check if has schedule override
            // only latest override per day per room will be used
            $scheduleOverride = ScheduleOverride::select('id', 'date', 'is_open', 'time_start', 'time_end')
                ->where('date', $request->date)
                ->whereHas('scheduleOverrideRooms', function ($query) use ($room) {
                    $query->where('room_id', $room->id);
                })
                ->with(['scheduleOverrideRooms' => function ($query) use ($room) {
                    $query->where('room_id', $room->id)
                        ->orderBy('id', 'desc')
                        ->limit(1);
                }])
                ->orderBy('id', 'desc')
                ->first();
            if ($scheduleOverride && $scheduleOverride->is_open) {
                $overrideTimes = getHours($scheduleOverride->time_start, $scheduleOverride->time_end);
                $availableTimes = array_merge($availableTimes, $overrideTimes);
            } else if ($scheduleOverride && !$scheduleOverride->is_open) {
                $overrideTimes = getHours($scheduleOverride->time_start, $scheduleOverride->time_end);
                $availableTimes = array_diff($availableTimes, $overrideTimes);
            }

            // Bookings: with Pending or Confirmed status from date/time
            foreach ($availableTimes as $time) {
                $bookings = Booking::where('room_id', $room->id)
                    ->whereNotIn('status', [config('global.booking_status.draft')[0], config('global.booking_status.canceled')[0]])
                    ->where('start_date', $request->date)
                    ->where('start_time', '<=', $time)
                    ->where('end_time', '>', $time)
                    ->get();
                if ($bookings->count() > 0 && $room->qty - $bookings->sum('qty') < 1) {
                    $availableTimes = array_diff($availableTimes, [$time]);
                }
            }
        }

        $availableTimes = array_values(array_unique($availableTimes));

        return Inertia::render('unauth/space/show', [
            'room' => $room,
            'availableTimes' => $availableTimes,
            'selectedDate' => $request->date,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
