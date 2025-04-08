<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


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
    // Add store method for creating announcements with file uploads
    public function store(Request $request)
    {
        try {
            Log::info('Announcement upload started', $request->except('file'));
            
            // Validate the request
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'author' => 'required|string|max:255',
                'status' => 'required|in:Active,Inactive',
                'file' => 'required|file|mimes:png,html',
                'publishTo' => 'required|string'
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
    
            // Insert the record first to get the ID
            $announcement = new Announcement();
            $announcement->title = $request->title;
            $announcement->author = $request->author;
            $announcement->status = $request->status;
            $announcement->content = '';  // Initially empty, will be updated later
            
            // Handle file type determination
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $announcement->type = ($extension === 'png') ? 'image' : 'html';
            
            // Handle division-specific publishing
            if ($request->publishTo === 'specific' && $request->has('division')) {
                $announcement->division = $request->division; // Store division code
            } else {
                $announcement->division = 'General'; // Use default value
            }
            
            // Save to get ID
            $announcement->save();
            
            // Create the proper filename
            $newFileName = $announcement->type === 'image' 
                ? 'AnnouncementImage' . $announcement->id . '.png' 
                : 'AnnouncementHtml' . $announcement->id . '.html';
            
            // Store the file in public storage
            $path = Storage::disk('public')->putFileAs(
                'announcement', 
                $file, 
                $newFileName
            );
            
            // Update the content with the proper path
            $announcement->content = '/storage/' . $path;
            $announcement->save();
            
            Log::info('Announcement upload completed successfully', [
                'id' => $announcement->id, 
                'path' => $announcement->content
            ]);
            
            return response()->json($announcement, 201);
        } catch (\Exception $e) {
            Log::error('Announcement upload failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }
}