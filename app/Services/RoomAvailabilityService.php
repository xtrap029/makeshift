<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\ScheduleOverride;
use Carbon\Carbon;

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
     * @param int|null $excludeBookingId Booking to ignore in the conflict check (e.g. the one being rescheduled)
     * @return array Status and message indicating availability
     */
    public function verifyRoomAvailability(Room $room, int $qty = 1, string $date, string $startTime, string $endTime, ?int $excludeBookingId = null): array
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
                ->when($excludeBookingId, fn ($query) => $query->where('id', '!=', $excludeBookingId))
                ->where('start_date', $date)
                ->where(
                    'start_time',
                    '<=',
                    $i < $startTime
                        ? sprintf('%02d:00', $i)
                        : sprintf('%02d:59', $i > 0 ? $i - 1 : 0)
                )
                ->where(
                    'end_time',
                    '>=',
                    $i < $endTime
                        ? sprintf('%02d:01', $i)
                        : sprintf('%02d:00', $i)
                )
                ->get();

            if ($bookings->count() > 0 && $room->qty - $bookings->sum('qty') < $qty) {
                return ['status' => false, 'message' => 'Room is already booked on this date/time. Please check the bookings.'];
            }
        }

        return ['status' => true];
    }

    /**
     * Days in a range where the room has no open hours at all — based on its weekly
     * schedule and date overrides only, NOT existing booking conflicts (that final
     * check still happens per-hour the moment a specific date is picked, exactly as
     * `verifyRoomAvailability()` already does). This is a browsing/calendar aid, not
     * the availability authority, so it stays cheap: one Schedule query, one bounded
     * ScheduleOverride query, then an in-memory loop over the range.
     *
     * @return string[] Closed dates in Y-m-d format
     */
    public function closedDaysForRange(Room $room, string $from, string $to): array
    {
        $schedule = Schedule::find($room->schedule_id);

        $overrides = ScheduleOverride::whereBetween('date', [$from, $to])
            ->whereHas('rooms', function ($query) use ($room) {
                $query->where('room_id', $room->id);
            })
            ->orderBy('id', 'desc')
            ->get()
            ->unique('date'); // Honor the latest override per date, same as the single-date check.

        $closed = [];
        $period = Carbon::parse($from)->toPeriod($to);

        foreach ($period as $day) {
            $date = $day->format('Y-m-d');
            $dateDay = strtolower($day->format('D'));

            $scheduleOpen = $schedule
                && $schedule->is_active
                && $schedule->{$dateDay . '_start'}
                && $schedule->{$dateDay . '_end'}
                && $schedule->max_day >= now()->diffInDays($date, false)
                && $schedule->max_date >= $date;

            $override = $overrides->firstWhere('date', $date);

            if ($override && $override->is_open) {
                continue; // Override opens the day regardless of the regular schedule.
            }

            if ($override && !$override->is_open) {
                // A partial closure (override window narrower than the schedule) still
                // leaves some hours open; only a closure covering the whole schedule
                // window (or no schedule at all) closes the day entirely.
                $fullyCovers = !$scheduleOpen
                    || ($override->time_start <= $schedule->{$dateDay . '_start'}
                        && $override->time_end >= $schedule->{$dateDay . '_end'});

                if ($fullyCovers) {
                    $closed[] = $date;
                }
                continue;
            }

            if (!$scheduleOpen) {
                $closed[] = $date;
            }
        }

        return $closed;
    }

    /**
     * Hourly start slots (H:i) the room can be booked at on a given date — its weekly
     * schedule, then the latest override for that date (open adds hours, closed removes
     * them), then any hour already at capacity from Pending/Confirmed bookings. This is
     * the same logic the public inquiry form uses to populate its time dropdown.
     *
     * @param int|null $excludeBookingId Booking to ignore in the conflict check (e.g. the one being rescheduled)
     * @return string[] Times in H:i format
     */
    public function availableTimesForDate(Room $room, string $date, ?int $excludeBookingId = null): array
    {
        $availableTimes = [];

        // check if has schedule
        $dateDay = strtolower(date('D', strtotime($date)));
        $roomSchedule = Schedule::select($dateDay . '_start as start', $dateDay . '_end as end')
            ->where('id', $room->schedule_id)
            ->where($dateDay . '_start', '!=', null)
            ->where($dateDay . '_end', '!=', null)
            ->where('is_active', true)
            ->where('max_day', '>=', now()->diffInDays($date))
            ->where('max_date', '>=', $date)
            ->first();
        if ($roomSchedule) {
            $availableTimes = getHours($roomSchedule->start, $roomSchedule->end);
        }

        // check if has schedule override
        // only latest override per day per room will be used
        $scheduleOverride = ScheduleOverride::select('id', 'date', 'is_open', 'time_start', 'time_end')
            ->where('date', $date)
            ->whereHas('scheduleOverrideRooms', function ($query) use ($room) {
                $query->where('room_id', $room->id);
            })
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
                ->whereNotIn('status', config('global.no_reserve_status'))
                ->when($excludeBookingId, fn ($query) => $query->where('id', '!=', $excludeBookingId))
                ->where('start_date', $date)
                ->where('start_time', '<=', $time)
                ->where('end_time', '>', $time)
                ->get();
            if ($bookings->count() > 0 && $room->qty - $bookings->sum('qty') < 1) {
                $availableTimes = array_diff($availableTimes, [$time]);
            }
        }

        return array_values(array_unique($availableTimes));
    }

    /**
     * Start slots from which a booking of `$hours` consecutive hours fits entirely
     * inside the available slots (so the derived end time is always bookable).
     *
     * @param string[] $availableTimes Times in H:i format
     * @return string[] Start times in H:i format
     */
    public function availableStartTimes(array $availableTimes, int $hours): array
    {
        $available = array_flip($availableTimes);

        return array_values(array_filter($availableTimes, function ($time) use ($available, $hours) {
            $start = (int) substr($time, 0, 2);
            if ($start + $hours > 23) {
                return false; // End time can't run past 23:00 (same cap as the public inquiry form).
            }
            for ($i = 0; $i < $hours; $i++) {
                if (!isset($available[sprintf('%02d:00', $start + $i)])) {
                    return false;
                }
            }
            return true;
        }));
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
