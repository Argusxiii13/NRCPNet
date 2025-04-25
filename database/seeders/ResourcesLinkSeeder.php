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
            '/resources/Resources1.png', // Dedicated icon for eRecords
            '/resources/Resources2.png', // Dedicated icon for eTicket
            '/resources/Resources3.png', // Dedicated icon for HRMIS
        ];
        
        // Default image path for other resources
        $defaultImage = '/resources/Resources0.png';

        // Hardcoded resources data
        $resources = [
            [
                'name' => 'eRecords',
                'link' => 'http://10.10.128.19/rmas'
            ],
            [
                'name' => 'eTicket',
                'link' => 'https://iservice.nrcp.dost.gov.ph'
            ],
            [
                'name' => 'HRMIS',
                'link' => 'http://10.10.128.11/hrmis'
            ],
            [
                'name' => 'Facebook',
                'link' => 'https://www.facebook.com'
            ],
            [
                'name' => 'Twitter',
                'link' => 'https://www.twitter.com'
            ],
            [
                'name' => 'Instagram',
                'link' => 'https://www.instagram.com'
            ],
            [
                'name' => 'LinkedIn',
                'link' => 'https://www.linkedin.com'
            ],
            [
                'name' => 'YouTube',
                'link' => 'https://www.youtube.com'
            ],
            [
                'name' => 'Reddit',
                'link' => 'https://www.reddit.com'
            ],
            [
                'name' => 'Pinterest',
                'link' => 'https://www.pinterest.com'
            ],
            [
                'name' => 'Snapchat',
                'link' => 'https://www.snapchat.com'
            ],
            [
                'name' => 'TikTok',
                'link' => 'https://www.tiktok.com'
            ],
            [
                'name' => 'WhatsApp',
                'link' => 'https://www.whatsapp.com'
            ],
            [
                'name' => 'Telegram',
                'link' => 'https://telegram.org'
            ],
            [
                'name' => 'Discord',
                'link' => 'https://discord.com'
            ],
            [
                'name' => 'Tumblr',
                'link' => 'https://www.tumblr.com'
            ],
            [
                'name' => 'Flickr',
                'link' => 'https://www.flickr.com'
            ],
            [
                'name' => 'Vimeo',
                'link' => 'https://www.vimeo.com'
            ],
            [
                'name' => 'Quora',
                'link' => 'https://www.quora.com'
            ],
            [
                'name' => 'SoundCloud',
                'link' => 'https://www.soundcloud.com'
            ],
            [
                'name' => 'Spotify',
                'link' => 'https://www.spotify.com'
            ],
            [
                'name' => 'Meetup',
                'link' => 'https://www.meetup.com'
            ],
            [
                'name' => 'Eventbrite',
                'link' => 'https://www.eventbrite.com'
            ],
            [
                'name' => 'MySpace',
                'link' => 'https://www.myspace.com'
            ],
            [
                'name' => 'Blogger',
                'link' => 'https://www.blogger.com'
            ],
            [
                'name' => 'Medium',
                'link' => 'https://www.medium.com'
            ],
        ];

        foreach ($resources as $index => $resource) {
            // Determine the image path based on the index
            if ($index < 3) {
                $imagePath = public_path($images[$index]); // Use dedicated icons for the first three
            } else {
                $imagePath = public_path($defaultImage); // Use default icon for others
            }

            // Check if the file exists
            if (file_exists($imagePath)) {
                $resourceName = $resource['name'];
                $resourceLink = $resource['link'];
                
                // Replace spaces with underscores in the name for the filename
                $formattedName = str_replace(' ', '_', $resourceName);

                // Insert the record first to get the ID
                $resourceId = DB::table('resources_link')->insertGetId([
                    'name' => $resourceName,
                    'link' => $resourceLink,
                    'icon' => '', // Initially empty, will be updated with path later
                    'status' => 'Active',
                    'author' => 'Edward Park',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Define the new file name and path based on the formatted name and ID
                $newFileName = $formattedName . '_' . $resourceId . '.png';

                // Store the image in the storage
                $path = Storage::disk('public')->putFileAs('resources', $imagePath, $newFileName);

                // Update the database record with the new image path
                DB::table('resources_link')->where('id', $resourceId)->update([
                    'icon' => '/storage/' . $path, // Store the new image path
                ]);
            } else {
                // Log or handle missing files
                Log::warning("File not found: $imagePath");
            }
        }
    }
}