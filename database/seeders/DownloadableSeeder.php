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

        // Form types array - our classification
        $formTypes = ['Request', 'Memo', 'Miscellaneous'];
        
        // Create 50 downloadable items
        for ($i = 1; $i <= 50; $i++) {
            // Choose a random file from the array
            $randomFileIndex = array_rand($files);
            $filePath = $files[$randomFileIndex];
            
            // Check if the file exists
            $fullPath = public_path($filePath);
            if (file_exists($fullPath)) {
                // Randomly assign one of the three form types
                $type = $formTypes[array_rand($formTypes)];
                
                // Create a custom title to distinguish different entries
                $customTitle = 'Document ' . $i . ' - ' . $type . ' (' . pathinfo(basename($filePath), PATHINFO_FILENAME) . ')';

                // Insert the record first to get the ID
                $downloadableId = DB::table('downloadable')->insertGetId([
                    'title' => $customTitle,
                    'content' => '', // Initially empty, will be updated with path later
                    'author' => 'Admin',
                    'type' => $type,
                    'division' => 'General', // Keep division as "General" as in the original code
                    'status' => 'Active',
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
                
                $this->command->info("Created downloadable item $i: $customTitle");
            } else {
                // Log or handle missing files
                Log::warning("File not found: $fullPath");
                $this->command->error("File not found: $fullPath");
            }
        }
        
        $this->command->info('Downloadable seeding completed! Created 50 items.');
    }
}