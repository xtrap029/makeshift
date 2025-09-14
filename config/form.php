<?php

return [
    'validation' => [
        'name' => [
            'min' => 3,
            'max' => 100,
        ],
        'email' => [
            'max' => 100,
        ],
        'phone' => [
            'min' => 10,
        ],
        'note' => [
            'max' => 255,
        ],
        'youtube' => [
            'max' => 1000,
        ],
        'map' => [
            'max' => 1000,
        ],
    ],
];
