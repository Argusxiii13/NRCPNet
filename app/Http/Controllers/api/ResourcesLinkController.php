<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ResourcesLink;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ResourcesLinkController extends Controller
{
    /**
     * Display all active resources
     */
    public function index()
    {
        $resources = ResourcesLink::where('status', 'Active')->get();

        return response()->json($resources);
    }

    /**
     * Store a new resource with icon upload
     */
    public function store(Request $request)
    {
        try {
            Log::info('Create resource link data: ', $request->all());

            // Process data before validation
            $data = $request->all();
            
            // Add protocol to URL if missing
            if (!empty($data['link']) && !preg_match('/^[a-zA-Z]+:\/\//', $data['link'])) {
                $data['link'] = 'https://' . $data['link'];
            }

            // Validate request data
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'link' => 'required|url|max:255',
                'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
                'status' => 'required|in:Active,Inactive',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors()
                ], 422);
            }

            // First, create the resource record with empty icon path
            $resource = ResourcesLink::create([
                'name' => $data['name'],
                'link' => $data['link'], // Using processed link
                'icon' => '', // Will be updated after we get the ID
                'status' => $data['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Check if an icon was uploaded
            if ($request->hasFile('icon')) {
                // Get the file
                $file = $request->file('icon');
                
                // Create a formatted name for the file
                $formattedName = str_replace(' ', '_', $data['name']);
                
                // Get the extension
                $extension = $file->getClientOriginalExtension();
                
                // Create new filename with Resource+ID format
                $newFileName = $formattedName . '_' . $resource->id . '.' . $extension;
                
                // Define the storage path
                $storageDirectory = 'resources';
                
                // Store the file in the public directory
                $path = $file->storeAs($storageDirectory, $newFileName, 'public');
                
                // Update the resource record with the file path
                $resource->update([
                    'icon' => '/storage/' . $path
                ]);
            }

            return response()->json([
                'status' => 201,
                'message' => 'Resource created successfully.',
                'resource' => $resource,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Create resource error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing resource
     */
    public function update(Request $request, $id)
    {
        try {
            $resource = ResourcesLink::findOrFail($id);
            
            Log::info('Update resource link data: ', $request->all());

            // Process data before validation
            $data = $request->all();
            
            // Add protocol to URL if missing
            if (!empty($data['link']) && !preg_match('/^[a-zA-Z]+:\/\//', $data['link'])) {
                $data['link'] = 'https://' . $data['link'];
            }

            // Validate request data
            $validator = Validator::make($data, [
                'name' => 'sometimes|required|string|max:255',
                'link' => 'sometimes|required|url|max:255',
                'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
                'status' => 'sometimes|required|in:Active,Inactive',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update text fields
            if (isset($data['name'])) {
                $resource->name = $data['name'];
            }
            
            if (isset($data['link'])) {
                $resource->link = $data['link'];
            }
            
            if (isset($data['status'])) {
                $resource->status = $data['status'];
            }

            // Check if a new icon was uploaded
            if ($request->hasFile('icon')) {
                // Delete old icon if exists
                if ($resource->icon && Storage::disk('public')->exists(str_replace('/storage/', '', $resource->icon))) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $resource->icon));
                }
                
                // Get the file
                $file = $request->file('icon');
                
                // Create a formatted name for the file
                $formattedName = str_replace(' ', '_', $resource->name);
                
                // Get the extension
                $extension = $file->getClientOriginalExtension();
                
                // Create new filename with Resource+ID format
                $newFileName = $formattedName . '_' . $resource->id . '.' . $extension;
                
                // Define the storage path
                $storageDirectory = 'resources';
                
                // Store the file in the public directory
                $path = $file->storeAs($storageDirectory, $newFileName, 'public');
                
                // Update the icon path
                $resource->icon = '/storage/' . $path;
            }

            $resource->updated_at = now();
            $resource->save();

            return response()->json([
                'status' => 200,
                'message' => 'Resource updated successfully.',
                'resource' => $resource,
            ]);
        } catch (\Exception $e) {
            Log::error('Update resource error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a resource
     */
    public function destroy($id)
    {
        try {
            $resource = ResourcesLink::findOrFail($id);
            
            // Delete the associated icon file if it exists
            if ($resource->icon && Storage::disk('public')->exists(str_replace('/storage/', '', $resource->icon))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $resource->icon));
            }
            
            $resource->delete();

            return response()->json([
                'status' => 204,
                'message' => 'Resource deleted successfully.'
            ], 204);
        } catch (\Exception $e) {
            Log::error('Delete resource error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}