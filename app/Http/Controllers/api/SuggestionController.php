<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Suggestion;

class SuggestionController extends Controller
{
    // Fetch all suggestions with optional filtering and pagination
    public function index(Request $request) {
        try {
            $query = Suggestion::query();
            
            // Apply division filter if provided
            if ($request->has('division') && !empty($request->division)) {
                $query->where('division', $request->division);
            }
            
            // Apply section filter if provided
            if ($request->has('section') && !empty($request->section)) {
                $query->where('section', $request->section);
            }
            
            // Apply search term if provided
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('content', 'LIKE', "%{$searchTerm}%");
                });
            }
            
            // Sort by created_at desc by default (newest first)
            $query->orderBy('created_at', 'desc');
            
            // Get pagination parameters (default to 10 items per page)
            $perPage = $request->has('per_page') ? (int)$request->per_page : 10;
            
            // Paginate results
            $suggestions = $query->paginate($perPage);
            
            return response()->json($suggestions);
        } catch (\Exception $e) {
            Log::error('Fetch suggestions error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Store a new suggestion
    public function store(Request $request) {
        $request->validate([
            'content' => 'required|string',
            'division' => 'required|string',
            'section' => 'nullable|string',
        ]);

        try {
            Log::info('Suggestion request received', $request->all());
            $suggestion = Suggestion::create($request->all());
            return response()->json([
                'status'=> 200,
                'message' =>'Suggestion Added Successfully',
                'data' => $suggestion
            ]);
        } catch (\Exception $e) {
            Log::error('Suggestion error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status'=> 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Update a suggestion
    public function update(Request $request, $id) {
        $request->validate([
            'content' => 'required|string',
            'division' => 'required|string',
            'section' => 'nullable|string',
            'status' => 'nullable|string',
            'adminnote' => 'nullable|string', // Changed to match database column name
        ]);
    
        try {
            $suggestion = Suggestion::findOrFail($id);
            $suggestion->update($request->all());
            return response()->json([
                'status' => 200,
                'message' => 'Suggestion updated successfully',
                'data' => $suggestion
            ]);
        } catch (\Exception $e) {
            Log::error('Update suggestion error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Delete a suggestion
    public function destroy($id) {
        try {
            $suggestion = Suggestion::findOrFail($id);
            $suggestion->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Suggestion deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Delete suggestion error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}