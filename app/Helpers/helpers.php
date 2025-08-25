<?php

use Illuminate\Support\Facades\Storage;

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

if (!function_exists('generateQr')) {
    function generateQr(string $text, string $folder = 'qrcodes', ?string $filename = null): string
    {
        $filename = $filename ?? time() . '.png';

        $generator = new \Milon\Barcode\DNS2D();
        $qrPng = $generator->getBarcodePNG($text, 'QRCODE', 10, 10);
        $qrImage = base64_decode($qrPng);

        Storage::disk('public')->makeDirectory($folder);
        Storage::disk('public')->put("$folder/$filename", $qrImage);

        return $filename;
    }
}
