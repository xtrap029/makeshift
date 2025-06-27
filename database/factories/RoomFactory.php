<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => ucwords(fake()->unique()->word() . ' ' . fake()->word()),
            'description' => fake()->sentence(),
            'is_private' => fake()->boolean(),
            'sqm' => fake()->numberBetween(10, 100),
            'qty' => fake()->numberBetween(1, 10),
            'cap' => fake()->numberBetween(1, 10),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'owner_id' => User::first()->id,
            'updated_id' => User::first()->id,
        ];
    }
}
