<?php

use App\Models\User;

test('guests receive a not found response', function () {
    $this->get('/dashboard')->assertNotFound();
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/dashboard')->assertOk();
});
