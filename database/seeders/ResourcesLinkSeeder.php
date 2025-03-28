<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ResourcesLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Image path constants
        $images = [
            '/resources/Resources1.png',
            '/resources/Resources2.png',
            '/resources/Resources3.png',
            '/resources/Resources4.png'
        ];

        foreach ($images as $index => $imagePath) {
            // Check if the file exists
            $fullPath = public_path($imagePath);
            if (file_exists($fullPath)) {
                // Define a name for the resource
                $resourceName = 'Example System ' . ($index + 1);
                
                // Replace spaces with underscores in the name for the filename
                $formattedName = str_replace(' ', '_', $resourceName);

                // Insert the record first to get the ID
                $resourceId = DB::table('resources_link')->insertGetId([
                    'name' => $resourceName,
                    'link' => 'https://www.example' . ($index + 1) . '.com',
                    'icon' => '', // Initially empty, will be updated with path later
                    'status' => 'Active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Define the new file name and path based on the formatted name and ID
                $newFileName = $formattedName . '_' . $resourceId . '.png';

                // Store the image in the storage
                $path = Storage::disk('public')->putFileAs('resources', $fullPath, $newFileName);

                // Update the database record with the new image path
                DB::table('resources_link')->where('id', $resourceId)->update([
                    'icon' => '/storage/' . $path, // Store the new image path
                ]);
            } else {
                // Log or handle missing files
                Log::warning("File not found: $fullPath");
            }
        }
    }
}