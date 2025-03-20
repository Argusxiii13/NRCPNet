<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    // Method to fetch announcements
    public function index()
    {
        // Retrieve all active announcements
        $announcements = Announcement::where('status', 'Active')->get();

        // Transform the records into the format expected by the front-end
        $formattedAnnouncements = $announcements->map(function ($announcement) {
            return [
                'type' => $announcement->type,
                'content' => $announcement->content,
                'altText' => $announcement->title // Optionally set altText if needed
            ];
        });

        // Return the formatted announcements as JSON
        return response()->json($formattedAnnouncements);
    }
}