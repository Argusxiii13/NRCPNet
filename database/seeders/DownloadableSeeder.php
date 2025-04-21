<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DownloadableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // File path constants
        $files = [
            '/downloadable/Document1.pdf',
            '/downloadable/Document2.pdf',
            '/downloadable/Document3.pdf',
            '/downloadable/Document4.pdf',
            '/downloadable/Document5.pdf',
            '/downloadable/Document6.pdf',
            '/downloadable/Document7.pdf',
            '/downloadable/Document8.pdf',
            '/downloadable/Document9.pdf',
            '/downloadable/Document10.pdf',
            '/downloadable/Document11.pdf',
            '/downloadable/Document12.pdf',
            '/downloadable/Document13.pdf',
            '/downloadable/Document14.pdf',
            '/downloadable/Document15.pdf',
            '/downloadable/Document16.pdf',
            '/downloadable/Document17.pdf',
            '/downloadable/Document18.pdf',
            '/downloadable/Document19.pdf',
        ];

        foreach ($files as $filePath) {
            // Check if the file exists
            $fullPath = public_path($filePath);
            if (file_exists($fullPath)) {
                // Randomly assign status
                $status = rand(0, 1) ? 'Active' : 'Inactive';
                
                // Randomly assign type (Regular or Request)
                $type = rand(0, 1) ? 'Regular' : 'Request';

                // Insert the record first to get the ID
                $downloadableId = DB::table('downloadable')->insertGetId([
                    'title' => basename($filePath), // Use the filename as the title
                    'content' => '', // Initially empty, will be updated with path later
                    'author' => 'Admin',
                    'type' => $type, // Add the random type (Regular or Request)
                    'status' => $status, // Store the random status
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Define the new file name and path
                $newFileName = 'Downloadable' . $downloadableId . '.' . pathinfo($fullPath, PATHINFO_EXTENSION);

                // Store the file in the public storage
                $path = Storage::disk('public')->putFileAs('downloadable', $fullPath, $newFileName);

                // Update the database record with the new file path
                DB::table('downloadable')->where('id', $downloadableId)->update([
                    'content' => '/storage/' . $path, // Store the new file path
                ]);
            } else {
                // Log or handle missing files
                Log::warning("File not found: $fullPath");
            }
        }
    }
}