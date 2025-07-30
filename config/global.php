<?php

return [
    'pagination_limit' => 10,
    'booking_status' => [
        'draft' => [1, 'Draft'],
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
];
