<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test user with randomly generated values
        User::factory()->create();

        // Call the DivisionSeeder
        $this->call(DivisionSeeder::class);
        $this->call(RolesSeeder::class);
    }
}