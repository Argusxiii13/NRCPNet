<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Feature;

class FeatureController extends Controller
{
    // Fetch all features
    public function index()
    {
        return Feature::all(['id', 'title', 'content', 'author', 'status']);
    }

    // Fetch features with pagination
    public function paginatedIndex(Request $request)
    {
        try {
            $query = Feature::query();
            
            // Apply filtering if necessary
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }
            
            // Apply search term if provided
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('content', 'LIKE', "%{$searchTerm}%");
                });
            }

            // Sort by created_at desc by default (newest first)
            $query->orderBy('created_at', 'desc');

            // Get pagination parameters (default to 10 items per page)
            $perPage = $request->has('per_page') ? (int)$request->per_page : 10;

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

    public function update(Request $request, $id)
{
    try {
        Log::info('Update feature request data: ', $request->all()); // Log the incoming request data

        $feature = Feature::findOrFail($id);
        
        // Validate request data
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        // Update feature
        $feature->update([
            'title' => $data['title'],
            'status' => $data['status'],
        ]);

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
            $feature = Feature::findOrFail($id); // Find the feature by ID

            $feature->delete(); // Delete the feature

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