<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CalendarSchedule;

class CalendarScheduleSeeder extends Seeder
{
    public function run()
    {
        $events = [
            ['date' => '2026-02-02', 'type' => 'Meeting', 'title' => 'Team Standup', 'time' => '09:00 - 09:30', 'location' => 'Conference Room A', 'description' => 'Daily team status update.'],
            ['date' => '2026-02-02', 'type' => 'Event', 'title' => 'Project Kickoff', 'time' => '14:00 - 15:30', 'location' => 'Main Hall', 'description' => 'New project launch and objectives overview.'],
            ['date' => '2026-02-03', 'type' => 'Meeting', 'title' => 'Weekly Sync', 'time' => '10:30 - 11:30', 'location' => 'Conference Room D', 'description' => 'Cross-functional team synchronization.'],
            ['date' => '2026-02-03', 'type' => 'Event', 'title' => 'New Hire Orientation', 'time' => '13:30 - 15:00', 'location' => 'HR Office', 'description' => 'Welcome and onboarding for new employees.'],
            ['date' => '2026-02-04', 'type' => 'Meeting', 'title' => 'Client Call', 'time' => '14:00 - 15:00', 'location' => 'Zoom', 'description' => 'Project progress review with client.'],
            ['date' => '2026-02-04', 'type' => 'Event', 'title' => 'Lunch and Learn', 'time' => '12:00 - 13:00', 'location' => 'Cafeteria', 'description' => 'Educational lunch session with guest speaker.'],
            ['date' => '2026-02-05', 'type' => 'Meeting', 'title' => 'Security Training', 'time' => '09:00 - 10:00', 'location' => 'Online', 'description' => 'Data security and compliance training session.'],
            ['date' => '2026-02-05', 'type' => 'Wellness', 'title' => 'Thursday Wellness Sports', 'time' => '15:00 - 17:00', 'location' => 'Sports Complex', 'description' => 'Sports and fitness activities.'],
            ['date' => '2026-02-06', 'type' => 'Meeting', 'title' => 'Weekly Debrief', 'time' => '10:30 - 11:30', 'location' => 'Conference Room E', 'description' => 'End of week team review and reflection.'],
            ['date' => '2026-02-08', 'type' => 'Meeting', 'title' => 'Weekly Planning Session', 'time' => '09:00 - 10:00', 'location' => 'Conference Room A', 'description' => 'Plan activities for the upcoming week.'],
            ['date' => '2026-02-08', 'type' => 'Event', 'title' => 'Team Coffee Social', 'time' => '10:30 - 11:30', 'location' => 'Break Room', 'description' => 'Casual team gathering and networking.'],
            ['date' => '2026-02-08', 'type' => 'Meeting', 'title' => 'Project Status Update', 'time' => '13:00 - 14:00', 'location' => 'Conference Room B', 'description' => 'Update on current project progress.'],
            ['date' => '2026-02-08', 'type' => 'Event', 'title' => 'Departmental Lunch', 'time' => '12:00 - 13:00', 'location' => 'Main Cafeteria', 'description' => 'Department-wide lunch gathering.'],
            ['date' => '2026-02-08', 'type' => 'Holiday', 'title' => 'Special Observance Day', 'time' => '14:30 - 15:30', 'location' => 'Main Hall', 'description' => 'Company-wide observance and reflection.'],
            ['date' => '2026-02-09', 'type' => 'Meeting', 'title' => 'Project Review', 'time' => '11:00 - 12:00', 'location' => 'Conference Room B', 'description' => 'Monthly review of ongoing projects.'],
            ['date' => '2026-02-09', 'type' => 'Event', 'title' => 'Employee Recognition', 'time' => '15:00 - 16:00', 'location' => 'Main Hall', 'description' => 'Celebrate team achievements and milestones.'],
            ['date' => '2026-02-10', 'type' => 'Meeting', 'title' => 'Sprint Planning', 'time' => '10:00 - 11:30', 'location' => 'Main Hall', 'description' => 'Planning session for next sprint.'],
            ['date' => '2026-02-12', 'type' => 'Holiday', 'title' => 'Office Anniversary', 'time' => '11:00 - 12:00', 'location' => 'Conference Room C', 'description' => 'Celebration of company founding day.'],
            ['date' => '2026-02-12', 'type' => 'Wellness', 'title' => 'Thursday Wellness Sports', 'time' => '15:00 - 17:00', 'location' => 'Sports Complex', 'description' => 'Sports and fitness activities.'],
            ['date' => '2026-02-14', 'type' => 'Holiday', 'title' => 'Valentines Day', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Office celebration day.'],
            ['date' => '2026-02-14', 'type' => 'Event', 'title' => 'Team Lunch', 'time' => '12:00 - 13:30', 'location' => 'Restaurant', 'description' => 'Special team outing and celebration.'],
            ['date' => '2026-02-16', 'type' => 'Event', 'title' => 'Department Sync Meeting', 'time' => '09:30 - 10:30', 'location' => 'Conference Room C', 'description' => 'Sync meeting with department heads.'],
            ['date' => '2026-02-16', 'type' => 'Meeting', 'title' => 'One-on-One Reviews', 'time' => '14:00 - 15:30', 'location' => 'Manager Offices', 'description' => 'Individual performance and feedback sessions.'],
            ['date' => '2026-02-17', 'type' => 'Meeting', 'title' => 'Quarterly Planning', 'time' => '09:00 - 11:00', 'location' => 'Executive Boardroom', 'description' => 'Q2 strategic planning and goal setting.'],
            ['date' => '2026-02-18', 'type' => 'Meeting', 'title' => 'Budget Planning', 'time' => '13:00 - 14:30', 'location' => 'Finance Office', 'description' => 'Q1 budget allocation and planning.'],
            ['date' => '2026-02-19', 'type' => 'Meeting', 'title' => 'Leadership Meeting', 'time' => '11:00 - 12:30', 'location' => 'Executive Boardroom', 'description' => 'Strategic planning with management team.'],
            ['date' => '2026-02-19', 'type' => 'Wellness', 'title' => 'Thursday Wellness Sports', 'time' => '15:00 - 17:00', 'location' => 'Sports Complex', 'description' => 'Sports and fitness activities.'],
            ['date' => '2026-02-20', 'type' => 'Meeting', 'title' => 'Client Feedback Session', 'time' => '11:00 - 12:00', 'location' => 'Zoom', 'description' => 'Gather feedback from key stakeholders.'],
            ['date' => '2026-02-23', 'type' => 'Event', 'title' => 'All-Hands Meeting', 'time' => '10:00 - 11:00', 'location' => 'Main Auditorium', 'description' => 'Monthly company-wide update and announcements.'],
            ['date' => '2026-02-23', 'type' => 'Meeting', 'title' => 'Department Meetings', 'time' => '14:00 - 15:00', 'location' => 'Multiple Rooms', 'description' => 'Individual department status updates.'],
            ['date' => '2026-02-25', 'type' => 'Meeting', 'title' => 'Training Session', 'time' => '14:00 - 15:30', 'location' => 'Training Room', 'description' => 'Professional development and skills training.'],
            ['date' => '2026-02-25', 'type' => 'Event', 'title' => 'Innovation Workshop', 'time' => '10:00 - 12:00', 'location' => 'Innovation Lab', 'description' => 'Brainstorming session for new ideas.'],
            ['date' => '2026-02-26', 'type' => 'Holiday', 'title' => 'Office Closed', 'time' => 'All Day', 'location' => 'N/A', 'description' => 'General Holiday.'],
            ['date' => '2026-02-26', 'type' => 'Wellness', 'title' => 'Thursday Wellness Sports', 'time' => '15:00 - 17:00', 'location' => 'Sports Complex', 'description' => 'Sports and fitness activities.'],
            ['date' => '2026-02-27', 'type' => 'Event', 'title' => 'Team Building Activity', 'time' => '16:00 - 18:00', 'location' => 'Recreation Center', 'description' => 'End of month team bonding event.'],
            ['date' => '2026-02-27', 'type' => 'Meeting', 'title' => 'Month End Wrap-up', 'time' => '10:00 - 11:00', 'location' => 'Conference Room A', 'description' => 'Review of month accomplishments and lessons learned.'],
        ];

        foreach ($events as $event) {
            CalendarSchedule::create($event);
        }
    }
}