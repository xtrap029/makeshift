<?php

namespace App\Http\Controllers\Unauth;

use App\Http\Controllers\Controller;
use App\Models\Layout;
use App\Models\Room;
use App\Services\DiscountService;
use App\Services\OfferService;
use App\Services\RoomAvailabilityService;
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

        $rooms = Room::select('id', 'name', 'cap', 'sqm', 'description', 'price')
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

        $rooms->each(function ($room) use ($request) {
            $room->discount = DiscountService::preview($room, $request->date);
        });

        return Inertia::render('unauth/space/index', [
            'rooms' => $rooms,
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $name, Request $request)
    {

        $room = Room::select(
            'id',
            'name',
            'cap',
            'sqm',
            'description',
            'price',
            'schedule_id',
            'qty'
        )->where('is_active', true)
            ->where('qty', '>', 0)
            ->where('name', $name)
            ->with(['image' => function ($query) {
                $query->select('name', 'room_id')->where('is_main', true);
            }])
            ->with(['images' => function ($query) {
                $query->select('name', 'room_id', 'caption')->where('is_main', false)->orderBy('order', 'asc');
            }])
            ->with(['layouts' => function ($query) {
                $query->select('name', 'room_id')->orderBy('name', 'asc');
            }])
            ->with(['amenities' => function ($query) {
                $query->select('name', 'icon', 'room_id');
            }])
            ->firstOrFail();

        $availableTimes = [];
        if ($room && $request->date && $request->date > now()->format('Y-m-d')) {
            $availableTimes = app(RoomAvailabilityService::class)->availableTimesForDate($room, $request->date);
        }

        $room->discount = DiscountService::preview($room, $request->date);

        return Inertia::render('unauth/space/show', [
            'room' => $room,
            'availableTimes' => $availableTimes,
            // Hours aren't chosen yet, so the modal evaluates these client-side.
            'vouchers' => $request->date
                ? OfferService::catalogFor($room, $request->date)
                : [],
            'selectedDate' => $request->date,
        ]);
    }
}
