<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    // Method to fetch all announcements
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

    // Method to fetch paginated announcements
    public function paginated(Request $request)
    {
        // Get pagination parameters from request
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 5);

        // Fetch paginated announcements
        $paginatedData = Announcement::paginate($perPage, ['*'], 'page', $page);

        // Transform the data to match the expected format
        $formattedData = $paginatedData->items();
        
        // Return the paginated data with pagination metadata
        return response()->json([
            'data' => $formattedData,
            'pagination' => [
                'total' => $paginatedData->total(),
                'per_page' => $paginatedData->perPage(),
                'current_page' => $paginatedData->currentPage(),
                'last_page' => $paginatedData->lastPage(),
                'from' => $paginatedData->firstItem(),
                'to' => $paginatedData->lastItem()
            ]
        ]);
    }

    // Add update method for editing announcements
    public function update(Request $request, $id)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'status' => 'required|in:Active,Inactive'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find the announcement
        $announcement = Announcement::find($id);
        
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        // Update the announcement
        $announcement->title = $request->title;
        $announcement->status = $request->status;
        
        if ($request->has('content')) {
            $announcement->content = $request->content;
        }
        
        if ($request->has('type')) {
            $announcement->type = $request->type;
        }
        
        $announcement->save();

        return response()->json($announcement);
    }

    // Add delete method
    public function destroy($id)
    {
        $announcement = Announcement::find($id);
        
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted successfully']);
    }
}