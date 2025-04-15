<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CalendarSchedule;

class CalendarScheduleSeeder extends Seeder
{
    public function run()
    {
        $events = [
            ['date' => '2025-03-03', 'type' => 'Meeting', 'title' => 'Team Standup', 'time' => '09:00 - 09:30', 'location' => 'Conference Room A', 'description' => 'Daily team status update.'],
            ['date' => '2025-03-07', 'type' => 'Meeting', 'title' => 'Client Call', 'time' => '14:00 - 15:00', 'location' => 'Zoom', 'description' => 'Project progress review with client.'],
            ['date' => '2025-03-14', 'type' => 'Event', 'title' => 'Pi Day', 'time' => 'All Day', 'location' => 'Office', 'description' => 'Celebration with pie for everyone!'],
            ['date' => '2025-03-17', 'type' => 'Holiday', 'title' => 'St. Patrick\'s Day', 'time' => 'All Day', 'location' => '-', 'description' => 'Office closed for holiday.'],
            ['date' => '2025-03-24', 'type' => 'Event', 'title' => 'Spring Equinox', 'time' => '15:30 - 16:30', 'location' => 'Courtyard', 'description' => 'Team building activity to welcome spring.'],
            ['date' => '2025-03-24', 'type' => 'Meeting', 'title' => 'Project Review', 'time' => '11:00 - 12:00', 'location' => 'Conference Room B', 'description' => 'Quarterly review of ongoing projects.'],
            ['date' => '2025-04-03', 'type' => 'Meeting', 'title' => 'Sprint Planning', 'time' => '10:00 - 11:30', 'location' => 'Main Hall', 'description' => 'Planning session for next sprint.'],
            ['date' => '2025-04-14', 'type' => 'Holiday', 'title' => 'Department Sync1', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],
            ['date' => '2025-04-14', 'type' => 'Holiday', 'title' => 'Department Sync2', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],
            ['date' => '2025-04-14', 'type' => 'Meeting', 'title' => 'Department Sync3', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],
            ['date' => '2025-04-14', 'type' => 'Event', 'title' => 'Department Sync4', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],

        ];

        foreach ($events as $event) {
            CalendarSchedule::create($event);
        }
    }
}