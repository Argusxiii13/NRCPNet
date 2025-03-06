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
        

        // Call the DivisionSeeder
        $this->call(DivisionSeeder::class);
        $this->call(RolesSeeder::class);
        User::factory()->count(10)->create();
    }
}