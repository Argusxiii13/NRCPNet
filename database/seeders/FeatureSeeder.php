<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Image path constants
        $images = [
            '/image/Feature1.png',
            '/image/Feature2.png',
            '/image/Feature3.png',
            '/image/Feature4.png',
            '/image/Feature5.png',
            '/image/Feature6.png',
        ];

        foreach ($images as $imagePath) {
            // Check if the file exists
            $fullPath = public_path($imagePath);
            if (file_exists($fullPath)) {
                // Randomly assign status
                $status = rand(0, 1) ? 'Active' : 'Inactive';

                // Insert the record first to get the ID
                $featureId = DB::table('feature')->insertGetId([
                    'title' => basename($imagePath), // Use the filename as the title
                    'content' => '', // Initially empty, will be updated with path later
                    'author' => 'Admin',
                    'status' => $status, // Store the random status
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Define the new file name and path
                $newFileName = 'Feature' . $featureId . '.png';
                $newFilePath = public_path('/feature/' . $newFileName);

                // Copy the image to the new location
                File::copy($fullPath, $newFilePath);

                // Update the database record with the new image path
                DB::table('feature')->where('id', $featureId)->update([
                    'content' => '/feature/' . $newFileName, // Store the new image path
                ]);
            } else {
                // Log or handle missing files
                echo "File not found: $fullPath\n";
            }
        }
    }
}