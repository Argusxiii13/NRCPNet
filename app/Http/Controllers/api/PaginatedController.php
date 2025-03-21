<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class PaginatedController extends Controller
{
    /**
     * Get paginated announcements
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAnnouncementsPaginated(Request $request)
    {
        // Get pagination parameters from request
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 5);
        
        // Get total count for pagination info
        $total = Announcement::count();
        
        // Get paginated data
        $announcements = Announcement::skip(($page - 1) * $perPage)
                                    ->take($perPage)
                                    ->get();
        
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
        
        // Return data with pagination information
        return response()->json([
            'data' => $formattedAnnouncements,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => ceil($total / $perPage)
            ]
        ]);
    }
}