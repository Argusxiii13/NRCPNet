<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ResourcesLink;
use Illuminate\Support\Facades\Validator;

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
     * Store a new resource
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'link' => 'required|url|max:255',
            'icon' => 'nullable|string|max:255',
            'status' => 'required|in:Active,Inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $resource = ResourcesLink::create($validator->validated());

        return response()->json($resource, 201);
    }

    /**
     * Update an existing resource
     */
    public function update(Request $request, $id)
    {
        $resource = ResourcesLink::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'link' => 'sometimes|required|url|max:255',
            'icon' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:Active,Inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $resource->update($validator->validated());

        return response()->json($resource);
    }

    /**
     * Delete a resource
     */
    public function destroy($id)
    {
        $resource = ResourcesLink::findOrFail($id);
        $resource->delete();

        return response()->json(null, 204);
    }
}