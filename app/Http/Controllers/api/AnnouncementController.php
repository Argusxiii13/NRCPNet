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
    // Retrieve all announcements (both active and inactive)
    $announcements = Announcement::all();

    // Transform the records with all needed fields
    $formattedAnnouncements = $announcements->map(function ($announcement) {
        return [
            'id' => $announcement->id,
            'title' => $announcement->title,
            'type' => $announcement->type,
            'content' => $announcement->content,
            'author' => $announcement->author,
            'status' => $announcement->status,
            'created_at' => $announcement->created_at,
            'updated_at' => $announcement->updated_at
        ];
    });

    return response()->json($formattedAnnouncements);
}
}