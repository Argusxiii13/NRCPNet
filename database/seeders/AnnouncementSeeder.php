<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample file paths
        $announcements = [
            '/announcement/Announcement1.png',
            '/announcement/Announcement2.html',
            '/announcement/Announcement3.png',
            '/announcement/Announcement4.html',
            '/announcement/Announcement5.png',
            '/announcement/Announcement6.html',
            '/announcement/Announcement7.png',
            '/announcement/Announcement8.html',
            '/announcement/Announcement9.png',
            '/announcement/Announcement10.html',
        ];

        foreach ($announcements as $announcementPath) {
            // Check if the file exists
            $fullPath = public_path($announcementPath);
            if (file_exists($fullPath)) {
                // Determine the type based on file extension
                $extension = pathinfo($announcementPath, PATHINFO_EXTENSION);
                $type = ($extension === 'png') ? 'image' : 'html';

                // Insert the record first to get the ID
                $announcementId = DB::table('announcements')->insertGetId([
                    'title' => basename($announcementPath), // Use the filename as the title
                    'type' => $type, // Set type based on file extension
                    'content' => '', // Initially empty, will be updated with path later
                    'author' => 'Admin',
                    'status' => 'Active', // Store the random status
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Construct the new file name according to the format name+type+id
                $newFileName = $type === 'image' ? 'AnnouncementImage' . $announcementId . '.png' : 'AnnouncementHtml' . $announcementId . '.html';

                // Store the image or HTML file in the public storage
                $path = Storage::disk('public')->putFileAs('announcement', $fullPath, $newFileName);

                // Update the database record with the new content path
                DB::table('announcements')->where('id', $announcementId)->update([
                    'content' => '/storage/' . $path, // Store the new content path
                ]);
            } else {
                // Log or handle missing files
                Log::warning("File not found: $fullPath");
            }
        }
    }
}