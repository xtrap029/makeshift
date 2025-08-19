<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\ScheduleOverride;

class RoomAvailabilityService
{
    /**
     * Verify if a room is available for the specified date and time range
     *
     * @param Room $room The room to check availability for
     * @param int $qty Quantity needed
     * @param string $date Date in Y-m-d format
     * @param string $startTime Start time in H:i format
     * @param string $endTime End time in H:i format
     * @return array Status and message indicating availability
     */
    public function verifyRoomAvailability(Room $room, int $qty = 1, string $date, string $startTime, string $endTime): array
    {
        $startTime = ltrim(substr($startTime, 0, 2), '0');
        $endTime = ltrim(substr($endTime, 0, 2), '0');

        // Room: is active
        if (!$room->is_active) {
            return ['status' => false, 'message' => 'Room is not active'];
        }

        // Room: max Qty. is enough
        if ($room->qty < $qty) {
            return ['status' => false, 'message' => 'Room has not enough quantity'];
        }

        // Loop through each hour to check if there are:
        // - Schedule override, Schedule, Bookings
        for ($i = $startTime; $i <= $endTime; $i++) {
            // Override: honor last entry
            $scheduleOverride = ScheduleOverride::where('date', $date)
                ->whereHas('rooms', function ($query) use ($room) {
                    $query->where('room_id', $room->id);
                })
                ->where('time_start', '<=', sprintf('%02d:00', $i))
                ->where('time_end', '>=', $i < $endTime ? sprintf('%02d:01', $i) : sprintf('%02d:00', $i))
                ->orderBy('created_at', 'desc')
                ->first();

            if ($scheduleOverride) {
                if (!$scheduleOverride->is_open) {
                    return ['status' => false, 'message' => 'Room is not open on this date. Please check the schedule override.'];
                }
            } else {
                // get date day
                $dateDay = strtolower(date('D', strtotime($date)));

                // Schedule: is active, max day, max date
                $schedule = Schedule::where('id', $room->schedule_id)
                    ->where('is_active', true)
                    ->where('max_day', '>=', now()->diffInDays($date))
                    ->where('max_date', '>=', $date)
                    ->where($dateDay . '_start', '<=', sprintf('%02d:00', $i))
                    ->where($dateDay . '_end', '>=', sprintf('%02d:00', $i))
                    ->first();

                if (!$schedule) {
                    return ['status' => false, 'message' => 'Schedule is not set for this date. Please check the schedule.'];
                }
            }

            // Bookings: with Pending or Confirmed status from date/time
            $bookings = Booking::where('room_id', $room->id)
                ->whereNotIn('status', config('global.no_reserve_status'))
                ->where('start_date', $date)
                ->where('start_time', '<=', $i < $startTime ? sprintf('%02d:00', $i) : sprintf('%02d:59', $i - 1))
                ->where('end_time', '>=', $i < $endTime ? sprintf('%02d:01', $i) : sprintf('%02d:00', $i))
                ->get();

            if ($bookings->count() > 0 && $room->qty - $bookings->sum('qty') < $qty) {
                return ['status' => false, 'message' => 'Room is already booked on this date/time. Please check the bookings.'];
            }
        }

        return ['status' => true];
    }

    /**
     * Check multiple rooms availability
     *
     * @param array $rooms Array of Room models
     * @param int $qty Quantity needed
     * @param string $date Date in Y-m-d format
     * @param string $startTime Start time in H:i format
     * @param string $endTime End time in H:i format
     * @return array Array of rooms with their availability status
     */
    public function checkMultipleRoomsAvailability(array $rooms, int $qty, string $date, string $startTime, string $endTime): array
    {
        $results = [];

        foreach ($rooms as $room) {
            $availability = $this->verifyRoomAvailability($room, $qty, $date, $startTime, $endTime);
            $results[] = [
                'room' => $room,
                'available' => $availability['status'],
                'message' => $availability['message'] ?? null
            ];
        }

        return $results;
    }
}
