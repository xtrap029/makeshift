<?php

return [
    'pagination_limit' => 10,
    'booking_status' => [
        'inquiry' => [1, 'Inquiry'],
        'pending' => [2, 'Pending'],
        'confirmed' => [3, 'Confirmed'],
        'canceled' => [4, 'Canceled'],
    ],
    'payment_status' => [
        'pending' => [1, 'Pending'],
        'paid' => [2, 'Paid'],
        'failed' => [3, 'Failed'],
        'expired' => [4, 'Expired'],
        'canceled' => [5, 'Canceled'],
        'refunded' => [6, 'Refunded'],
    ],
    'no_reserve_status' => [1, 4],
    'image_mimes' => 'jpeg,png,jpg,svg',
    'favicon_mimes' => 'jpeg,png,jpg,ico,gif',
    'settings' => [
        'logo_mimes' => 'png',
        'logo_max_size' => 2048,
        'favicon_mimes' => 'ico',
        'favicon_max_size' => 512,
        'site_description_max_size' => 30,
    ]
];
