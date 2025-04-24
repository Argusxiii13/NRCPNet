<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Image path constants
        $images = [
            '/feature/Feature1.png',
            '/feature/Feature2.png',
            '/feature/Feature3.png',
            '/feature/Feature4.png',
            '/feature/Feature5.png',
            '/feature/Feature6.png',
        ];

        foreach ($images as $imagePath) {
            // Check if the file exists
            $fullPath = public_path($imagePath);
            if (file_exists($fullPath)) {
                
                // Insert the record first to get the ID
                $featureId = DB::table('feature')->insertGetId([
                    'title' => basename($imagePath), // Use the filename as the title
                    'content' => '', // Initially empty, will be updated with path later
                    'author' => 'Admin',
                    'status' => 'Active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Define the new file name and path
                $newFileName = 'Feature' . $featureId . '.png';

                // Store the image in the public storage
                $path = Storage::disk('public')->putFileAs('feature', $fullPath, $newFileName);

                // Update the database record with the new image path
                DB::table('feature')->where('id', $featureId)->update([
                    'content' => '/storage/' . $path, // Store the new image path
                ]);
            } else {
                // Log or handle missing files
                Log::warning("File not found: $fullPath");
            }
        }
    }
}