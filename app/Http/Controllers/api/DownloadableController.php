<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Downloadable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DownloadableController extends Controller
{
    // Fetch all downloadable forms (now with pagination support)
    public function index(Request $request)
    {
        try {
            // Check if pagination parameters are provided
            if ($request->has('per_page') || $request->has('page')) {
                $query = Downloadable::query();
                
                // Apply filtering if necessary
                if ($request->has('status') && !empty($request->status)) {
                    $query->where('status', $request->status);
                }
                
                // Sort by created_at desc by default (newest first)
                $query->orderBy('created_at', 'desc');
                
                // Get pagination parameters
                $perPage = $request->has('per_page') ? (int)$request->per_page : 4;
                
                // Paginate results
                return response()->json($query->paginate($perPage));
            }
            
            // Return all forms if no pagination is requested
            $downloadables = Downloadable::all(['id', 'title', 'content', 'author', 'status']);
            return response()->json($downloadables);
        } catch (\Exception $e) {
            Log::error('Fetch downloadables error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Update a downloadable form
    public function update(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:Active,Inactive',
        ]);

        try {
            // Find the downloadable form by ID
            $downloadable = Downloadable::findOrFail($id);
            
            // Update the form data
            $downloadable->title = $request->title;
            $downloadable->status = $request->status;
            
            // Save the changes
            $downloadable->save();
            
            return response()->json([
                'message' => 'Downloadable form updated successfully',
                'data' => $downloadable
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update downloadable form',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete a downloadable form
    public function destroy($id)
    {
        try {
            // Find the downloadable form by ID
            $downloadable = Downloadable::findOrFail($id);
            
            // Delete the form
            $downloadable->delete();
            
            return response()->json([
                'message' => 'Downloadable form deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete downloadable form',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
{
    // Validate the request data
    $request->validate([
        'title' => 'required|string|max:255',
        'file' => 'required|file|mimes:pdf',
        'status' => 'required|in:active,inactive,Active,Inactive',
    ]);

    try {
        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // Create a new downloadable record first to get the ID
            $downloadable = new Downloadable();
            $downloadable->title = $request->title;
            $downloadable->author = 'Admin'; // Set author to Admin by default
            $downloadable->status = ucfirst(strtolower($request->status)); // Ensure consistent casing
            $downloadable->content = ''; // Temporary placeholder
            $downloadable->save();
            
            // Generate a unique filename using the new ID
            $filename = 'Downloadable' . $downloadable->id . '.' . $file->getClientOriginalExtension();
            
            // Store the file in the storage/app/public/downloadable directory
            $path = $file->storeAs('downloadable', $filename, 'public');
            
            // Update the content field with the file path
            $downloadable->content = '/storage/' . $path;
            $downloadable->save();
            
            return response()->json([
                'status' => 200,
                'message' => 'Form uploaded successfully',
                'data' => $downloadable
            ], 200);
        }
        
        return response()->json([
            'status' => 400,
            'message' => 'No file was uploaded',
        ], 400);
        
    } catch (\Exception $e) {
        Log::error('Upload downloadable error: ' . $e->getMessage());
        return response()->json([
            'status' => 500,
            'message' => 'Error: ' . $e->getMessage(),
        ], 500);
    }
}
/**
 * Fetch all forms by type (downloadable or request)
 * This is a new method that won't interfere with existing ones
 */
/**
 * Fetch both downloadable and request forms
 * This is a new method that won't touch existing functionality
 */
public function getAllFormsByType(Request $request)
{
    try {
        // Start with a base query
        $query = Downloadable::query();
        
        // Apply status filter if provided
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }
        
        // Apply type filter if provided
        if ($request->has('type') && !empty($request->type)) {
            $query->where('type', $request->type);
        }
        
        // Sort by created_at desc by default (newest first)
        $query->orderBy('created_at', 'desc');
        
        // Get all forms matching criteria
        $forms = $query->get(['id', 'title', 'content', 'author', 'status', 'type']);
        
        // Group forms by type - updating to match the seeder types
        $downloadableForms = $forms->filter(function($form) {
            return $form->type === 'Regular' || !$form->type;
        })->values();
        
        $requestForms = $forms->filter(function($form) {
            return $form->type === 'Request';
        })->values();
        
        return response()->json([
            'downloadable' => $downloadableForms,
            'request' => $requestForms
        ]);
    } catch (\Exception $e) {
        Log::error('Fetch forms by type error: ' . $e->getMessage());
        return response()->json([
            'status' => 500,
            'message' => 'Error: ' . $e->getMessage(),
        ], 500);
    }
}
    
}