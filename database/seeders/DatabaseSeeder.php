<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Suggestion;
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
        $this->call(RoleSeeder::class);
        $this->call(FeatureSeeder::class);
        User::factory()->count(13)->create();
        Suggestion::factory()->count(8)->create();
        
    }
}