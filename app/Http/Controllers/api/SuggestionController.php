<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Suggestion;

class SuggestionController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'content' => 'required|string',
            'division' => 'required|string', // Adjust this based on your data type
            'section' => 'nullable|string',
        ]);
    
        try {
            // Log the request for debugging
            Log::info('Suggestion request received', $request->all());
    
            // Create a new suggestion
            $suggestion = Suggestion::create($request->all());
            
            return response()->json([
                'status'=> 200,
                'message' =>'Suggestion Added Successfully',
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
}