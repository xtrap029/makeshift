<?php

use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('local');
    config()->set('cache.default', 'array');
    $this->artisan('migrate');
});

it('creates a manual backup', function () {
    ensureSqliteDatabaseFile();

    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/database/backups');

    $response->assertRedirect();
    expect(Storage::disk('local')->files('backups'))->toHaveCount(1);
});

it('lists backups in the index page', function () {
    Storage::disk('local')->put('backups/sample.sql', 'backup');
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/database');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('database/index')
        ->where('backups.0.name', 'sample.sql')
    );
});

it('downloads a backup file', function () {
    Storage::disk('local')->put('backups/sample.sql', 'backup');
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/database/backups/sample.sql');

    $response->assertOk();
    $response->assertDownload('sample.sql');
});

function ensureSqliteDatabaseFile(): void
{
    $databasePath = config('database.connections.sqlite.database');

    if (! str_starts_with($databasePath, '/')) {
        $databasePath = database_path($databasePath);
    }

    if (! file_exists($databasePath)) {
        file_put_contents($databasePath, 'test');
    }
}
