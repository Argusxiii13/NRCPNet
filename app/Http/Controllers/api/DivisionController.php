<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class DivisionController extends Controller
{
    public function index()
    {
        return Division::with('sections')->get();
    }

    public function getDivisions()
    {
    // Fetch only the divisions without sections
    return Division::all(['id', 'name', 'code']); // Adjust fields as necessary
    }

    public function store(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:divisions|max:255',
            'name' => 'required|string|max:255',
            'has_sections' => 'required|boolean',
            'sections' => 'nullable|array',
            'sections.*.name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create the division
        $division = Division::create([
            'code' => $request->code,
            'name' => $request->name,
            'has_sections' => $request->has_sections,
        ]);

        // If sections are provided, create them
        if ($request->has_sections && isset($request->sections)) {
            foreach ($request->sections as $section) {
                Section::create([
                    'name' => $section['name'],
                    'division_id' => $division->id,
                ]);
            }
        }

        return response()->json([
            'message' => 'Division created successfully.',
            'division' => $division->load('sections'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Find the division
        $division = Division::findOrFail($id);

        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:255|unique:divisions,code,' . $division->id,
            'name' => 'required|string|max:255',
            'has_sections' => 'required|boolean',
            'sections' => 'nullable|array',
            'sections.*.name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Update the division
        $division->update([
            'code' => $request->code,
            'name' => $request->name,
            'has_sections' => $request->has_sections,
        ]);

        // Remove existing sections if necessary
        if ($request->has_sections && isset($request->sections)) {
            // Clear existing sections
            $division->sections()->delete();

            // Create new sections
            foreach ($request->sections as $section) {
                Section::create([
                    'name' => $section['name'],
                    'division_id' => $division->id,
                ]);
            }
        }
        

        return response()->json([
            'message' => 'Division updated successfully.',
            'division' => $division->load('sections'),
        ]);
    }
    public function destroy($id)
{
    // Find the division by ID
    $division = Division::findOrFail($id);
    
    // Optional: Check for related sections if necessary and handle them
    // Example: $division->sections()->delete(); // Uncomment if you want to delete related sections

    // Delete the division
    $division->delete();

    return response()->json(['message' => 'Division deleted successfully.']);
}
// Add this method to your AuthController or create a new UserController
public function getCurrentUserDivision()
{
    if (Auth::check()) {
        $user = Auth::user();
        return response()->json([
            'division' => $user->division // Assuming the user model has a division field
        ]);
    }
    
    return response()->json([
        'division' => 'General' // Default division if not logged in
    ]);
}
}