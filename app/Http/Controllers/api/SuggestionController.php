<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Suggestion;

class SuggestionController extends Controller
{
    // Fetch all suggestions with optional filtering and pagination

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