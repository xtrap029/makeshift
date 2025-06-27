<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Room;
use App\Models\Amenity;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Room::factory(10)->create();
        Amenity::factory(10)->create();
    }
}
