<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;

use App\Models\Announcement;
use App\Models\Feature;
use App\Models\Suggestion;
use App\Models\ResourcesLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $perPage = $request->input('perPage', 5);
        
        // Get paginated data
        $announcements = Announcement::paginate($perPage);
        
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
                'total' => $announcements->total(),
                'per_page' => $announcements->perPage(),
                'current_page' => $announcements->currentPage(),
                'last_page' => $announcements->lastPage()
            ]
        ]);
    }
    public function getFeaturesPaginated(Request $request)
    {
        try {
            // Query for features
            $query = Feature::query();
    
            // Sort by created_at desc (newest first)
            $query->orderBy('created_at', 'desc');
    
            // Get pagination parameters (default to 10 items per page)
            $perPage = $request->has('per_page') ? (int)$request->per_page : 6;
    
            // Paginate results
            $features = $query->paginate($perPage);
    
            return response()->json($features);
        } catch (\Exception $e) {
            Log::error('Fetch features error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getSuggestionsPaginated(Request $request)
    {
        try {
            // Initialize query
            $query = Suggestion::query();
            
            // Apply division filter if provided
            if ($request->has('division') && !empty($request->division)) {
                $query->where('division', $request->division);
            }
            
            // Apply status filter if provided
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }
            
            // Sort by created_at desc by default (newest first)
            $query->orderBy('created_at', 'desc');
            
            // Get pagination parameters (default to 10 items per page)
            $perPage = $request->input('per_page', 10);
            
            // Paginate results
            $suggestions = $query->paginate($perPage);
            
            // Transform the records with all needed fields
            $formattedSuggestions = collect($suggestions->items())->map(function ($suggestion) {
                return [
                    'id' => $suggestion->id,
                    'content' => $suggestion->content,
                    'division' => $suggestion->division,
                    'section' => $suggestion->section,
                    'status' => $suggestion->status,
                    'assignee' => $suggestion->assignee,
                    'adminnote' => $suggestion->adminnote,
                    'created_at' => $suggestion->created_at,
                    'updated_at' => $suggestion->updated_at
                ];
            });
            
            // Return data with pagination information
            return response()->json([
                'data' => $formattedSuggestions,
                'pagination' => [
                    'total' => $suggestions->total(),
                    'per_page' => $suggestions->perPage(),
                    'current_page' => $suggestions->currentPage(),
                    'last_page' => $suggestions->lastPage()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Fetch suggestions error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getResourcesPaginated(Request $request)
{
    try {
        // Query for resources
        $query = ResourcesLink::query();

        // Sort by created_at desc (newest first)
        $query->orderBy('created_at', 'desc');

        // Get pagination parameters (default to 10 items per page)
        $perPage = $request->has('per_page') ? (int)$request->per_page : 3;

        // Paginate results
        $resources = $query->paginate($perPage);

        return response()->json($resources);
    } catch (\Exception $e) {
        Log::error('Fetch resources error: ' . $e->getMessage());
        return response()->json([
            'status' => 500,
            'message' => 'Error: ' . $e->getMessage(),
        ], 500);
    }
}

}