<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CalendarSchedule;

class CalendarScheduleSeeder extends Seeder
{
    public function run()
    {
        $events = [
            ['date' => '2025-04-03', 'type' => 'Meeting', 'title' => 'Team Standup', 'time' => '09:00 - 09:30', 'location' => 'Conference Room A', 'description' => 'Daily team status update.'],
            ['date' => '2025-04-07', 'type' => 'Meeting', 'title' => 'Client Call', 'time' => '14:00 - 15:00', 'location' => 'Zoom', 'description' => 'Project progress review with client.'],
            ['date' => '2025-04-24', 'type' => 'Wellness', 'title' => 'Spring Equinox', 'time' => '15:00 - 17:00', 'location' => 'Courtyard', 'description' => 'Team building activity to welcome spring.'],
            ['date' => '2025-04-23', 'type' => 'Meeting', 'title' => 'Project Review', 'time' => '11:00 - 12:00', 'location' => 'Conference Room B', 'description' => 'Quarterly review of ongoing projects.'],
            ['date' => '2025-04-03', 'type' => 'Meeting', 'title' => 'Sprint Planning', 'time' => '10:00 - 11:30', 'location' => 'Main Hall', 'description' => 'Planning session for next sprint.'],
            ['date' => '2025-04-25', 'type' => 'Holiday', 'title' => 'Department Sync1', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],
            ['date' => '2025-04-25', 'type' => 'Holiday', 'title' => 'Department Sync2', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],
            ['date' => '2025-04-25', 'type' => 'Meeting', 'title' => 'Department Sync3', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],
            ['date' => '2025-04-25', 'type' => 'Event', 'title' => 'Department Sync4', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],

        ];

        foreach ($events as $event) {
            CalendarSchedule::create($event);
        }
    }
}