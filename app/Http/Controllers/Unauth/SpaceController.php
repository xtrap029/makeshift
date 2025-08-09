<?php

namespace App\Http\Controllers\Unauth;

use App\Http\Controllers\Controller;
use App\Models\Room;
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
            'date' => 'nullable|date|after_or_equal:' . now()->format('Y-m-d'),
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
                    })
                    // Exclude: Schedule override is explicitly closed (is_open = false)
                    ->whereDoesntHave('scheduleOverrideRooms', function ($subQuery) use ($request) {
                        $subQuery->whereHas('scheduleOverride', function ($q) use ($request) {
                            $q->where('date', $request->date)
                                ->where('is_open', false);
                        });
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
    public function show(string $name)
    {
        $room = Room::select('id', 'name', 'cap', 'sqm', 'description', 'price')
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

        return Inertia::render('unauth/space/show', [
            'room' => $room,
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
