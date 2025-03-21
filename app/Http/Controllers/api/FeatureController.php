<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Feature;

class FeatureController extends Controller
{
    // Fetch all features
    public function index()
    {
        return Feature::all(['id', 'title', 'content', 'author', 'status']);
    }


    // Store a new feature with file upload
    public function store(Request $request)
    {
        try {
            Log::info('Create feature request data: ', $request->all());

            // Validate request data
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'status' => 'required|string|in:active,inactive,Active,Inactive',
                'file' => 'required|file|mimes:jpeg,png,jpg,pdf,doc,docx,txt|max:10240', // 10MB max
                'division' => 'nullable|string',
                'publish_to' => 'nullable|string',
            ]);

            // First, create the Feature record with empty content
            $feature = Feature::create([
                'title' => $validatedData['title'],
                'content' => '', // Will be updated after we get the ID
                'status' => ucfirst(strtolower($validatedData['status'])), // Ensure consistent capitalization
                'author' => $request->user() ? $request->user()->name : 'Admin',
                'division' => $validatedData['division'] ?? null,
                'publish_to' => $validatedData['publish_to'] ?? null,
            ]);

            // Get the extension of the uploaded file
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            
            // Create new filename with Feature+ID format
            $newFileName = 'Feature' . $feature->id . '.' . $extension;
            
            // Define the storage path
            $storageDirectory = 'feature'; // Public directory for storing features
            
            // Store the file in the public directory
            $path = $file->storeAs($storageDirectory, $newFileName, 'public');
            
            // Update the feature record with the file path
            $feature->update([
                'content' => '/storage/' . $path // Update with the public URL
            ]);

            return response()->json([
                'status' => 201,
                'message' => 'Feature created successfully.',
                'feature' => $feature,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Create feature error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('Update feature request data: ', $request->all());

            $feature = Feature::findOrFail($id);
            
            // Validate request data
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'status' => 'required|string|in:Active,Inactive,active,inactive',
                'file' => 'nullable|file|mimes:jpeg,png,jpg,pdf,doc,docx,txt|max:10240', // Optional file upload
            ]);

            // Update data
            $updateData = [
                'title' => $validatedData['title'],
                'status' => ucfirst(strtolower($validatedData['status'])), // Ensure consistent capitalization
            ];

            // Handle file upload if present
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $extension = $file->getClientOriginalExtension();
                
                // Create new filename with Feature+ID format
                $newFileName = 'Feature' . $feature->id . '.' . $extension;
                
                // Define the storage path
                $storageDirectory = 'feature';
                
                // Delete old file if exists
                if ($feature->content) {
                    $oldPath = str_replace('/storage/', '', $feature->content);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                // Store the new file
                $path = $file->storeAs($storageDirectory, $newFileName, 'public');
                
                // Add file path to update data
                $updateData['content'] = '/storage/' . $path;
            }

            // Update the feature
            $feature->update($updateData);

            return response()->json([
                'status' => 200,
                'message' => 'Feature updated successfully.',
                'feature' => $feature,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Feature not found: ' . $e->getMessage());
            return response()->json([
                'status' => 404,
                'message' => 'Feature not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Update feature error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Delete a feature by ID
    public function destroy($id)
    {
        try {
            $feature = Feature::findOrFail($id);

            // Delete the associated file if it exists
            if ($feature->content) {
                $filePath = str_replace('/storage/', '', $feature->content);
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }

            // Delete the feature record
            $feature->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Feature deleted successfully.',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Feature not found: ' . $e->getMessage());
            return response()->json([
                'status' => 404,
                'message' => 'Feature not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Delete feature error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}