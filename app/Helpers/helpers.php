<?php

if (!function_exists('getHours')) {
    function getHours($start, $end)
    {
        $start = strtotime($start);
        $end = strtotime($end);
        for ($time = $start; $time < $end; $time += 3600) {
            $hours[] = date('H:i', $time);
        }
        return $hours;
    }
}
