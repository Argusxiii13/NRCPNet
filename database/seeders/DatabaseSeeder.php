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
        $this->call(DownloadableSeeder::class);
        $this->call(AnnouncementSeeder::class);
        $this->call(CalendarScheduleSeeder::class);
        $this->call(ResourcesLinkSeeder::class);
        User::factory()->count(40)->create();
        Suggestion::factory()->count(40)->create();
        
    }
}