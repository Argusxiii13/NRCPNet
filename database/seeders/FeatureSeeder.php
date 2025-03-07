<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
        ];

        foreach ($images as $imagePath) {
            // Check if the file exists
            $fullPath = public_path($imagePath);
            if (file_exists($fullPath)) {
                $imageData = file_get_contents($fullPath); // Read the image file
                $base64Data = base64_encode($imageData); // Convert to base64
                
                DB::table('feature')->insert([
                    'title' => basename($imagePath), // Use the filename as the title
                    'content' => $base64Data, // Store as base64 string
                    'author' => 'Admin',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                // Log or handle missing files
                echo "File not found: $fullPath\n";
            }
        }
    }
}