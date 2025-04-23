<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Downloadable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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
            $downloadables = Downloadable::all(['id', 'title', 'content', 'author', 'status', 'type', 'division']);
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
            'type' => 'sometimes|string|in:Request,Memo,Miscellaneous', // Add optional type validation
            'division' => 'sometimes|string|max:255', // Add optional division validation
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
                
                // Set type if provided, default to Miscellaneous if not
                $downloadable->type = $request->has('type') ? $request->type : 'Miscellaneous';
                
                // Set division if provided, default to General if not
                $downloadable->division = $request->has('division') ? $request->division : 'General';
                
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
     * Fetch forms by type (updated to use new types)
     * This method now returns forms grouped by the three types: Request, Memo, and Miscellaneous
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
            
            // Apply search filter if provided
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where('title', 'like', "%{$search}%");
            }
            
            // Sort by created_at desc by default (newest first)
            $query->orderBy('created_at', 'desc');
            
            // Get all forms matching criteria
            $forms = $query->get(['id', 'title', 'content', 'author', 'status', 'type', 'division']);
            
            // Group forms by type - updated to use the new types
            $requestForms = $forms->filter(function($form) {
                return $form->type === 'Request';
            })->values();
            
            $memoForms = $forms->filter(function($form) {
                return $form->type === 'Memo';
            })->values();
            
            $miscForms = $forms->filter(function($form) {
                return $form->type === 'Miscellaneous' || !$form->type;
            })->values();
            
            return response()->json([
                'request' => $requestForms,
                'memo' => $memoForms,
                'miscellaneous' => $miscForms
            ]);
        } catch (\Exception $e) {
            Log::error('Fetch forms by type error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Update a downloadable form with extended fields
     * This is a new method that won't interfere with existing components
     */
    public function updateForm(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:Active,Inactive',
            'division' => 'required|string|max:255',
            'type' => 'required|string|in:Request,Memo,Miscellaneous', // Updated valid types
        ]);

        try {
            // Find the downloadable form by ID
            $downloadable = Downloadable::findOrFail($id);
            
            // Update the form data with all fields
            $downloadable->title = $request->title;
            $downloadable->status = $request->status;
            $downloadable->division = $request->division;
            $downloadable->type = $request->type;
            
            // Save the changes
            $downloadable->save();
            
            return response()->json([
                'message' => 'Downloadable form updated successfully',
                'data' => $downloadable
            ], 200);
        } catch (\Exception $e) {
            Log::error('Update downloadable form error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update downloadable form',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Store a new downloadable form with additional metadata
     * This is a new method that won't interfere with existing components
     */
    public function storeWithMetadata(Request $request)
    {
        // Validate the request data
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf',
            'status' => 'required|in:active,inactive,Active,Inactive',
            'division' => 'required|string|max:255',
            'type' => 'required|string|in:Request,Memo,Miscellaneous', // Updated valid types
        ]);

        try {
            // Handle file upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                
                // Create a new downloadable record with all fields
                $downloadable = new Downloadable();
                $downloadable->title = $request->title;
                $downloadable->author = 'Admin'; // Set author to Admin by default
                $downloadable->status = ucfirst(strtolower($request->status)); // Ensure consistent casing
                $downloadable->division = $request->division;
                $downloadable->type = $request->type;
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
                    'message' => 'Form with metadata uploaded successfully',
                    'data' => $downloadable
                ], 200);
            }
            
            return response()->json([
                'status' => 400,
                'message' => 'No file was uploaded',
            ], 400);
            
        } catch (\Exception $e) {
            Log::error('Upload downloadable with metadata error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Fetch forms filtered by division
     * This accepts a division parameter and returns forms from that division and General
     */
    public function getFormsByDivision(Request $request)
    {
        try {
            // Start with a base query
            $query = Downloadable::query();
            
            // Apply status filter if provided (default to Active)
            $status = $request->has('status') ? $request->status : 'Active';
            $query->where('status', $status);
            
            // Get division from request or use authenticated user's division
            $division = null;
            
            if ($request->has('division') && !empty($request->division)) {
                $division = $request->division;
            } elseif (Auth::check() && Auth::user()->division) {
                $division = Auth::user()->division;
            }
            
            // Apply search filter if provided
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where('title', 'like', "%{$search}%");
            }
            
            // If we have a division, filter to show General and that division
            if ($division) {
                $query->where(function($q) use ($division) {
                    $q->where('division', 'General')
                      ->orWhere('division', $division);
                });
            } else {
                // If no division specified, only show General forms
                $query->where('division', 'General');
            }
            
            // Sort by created_at desc by default (newest first)
            $query->orderBy('created_at', 'desc');
            
            // Get all forms matching criteria
            $forms = $query->get(['id', 'title', 'content', 'author', 'status', 'type', 'division']);
            
            // Group forms by type
            $requestForms = $forms->filter(function($form) {
                return $form->type === 'Request';
            })->values();
            
            $memoForms = $forms->filter(function($form) {
                return $form->type === 'Memo';
            })->values();
            
            $miscForms = $forms->filter(function($form) {
                return $form->type === 'Miscellaneous' || !$form->type;
            })->values();
            
            return response()->json([
                'request' => $requestForms,
                'memo' => $memoForms,
                'miscellaneous' => $miscForms
            ]);
        } catch (\Exception $e) {
            Log::error('Fetch forms by division error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}