<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Get all roles
    public function index()
    {
        return Role::all();
    }

    // Store a new role
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'permissions' => 'required|array',
        ]);

        $role = Role::create($request->all());
        return response()->json($role, 201);
    }

    // Update a role
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'permissions' => 'required|array',
        ]);

        $role->update($request->all());
        return response()->json($role);
    }

    // Delete a role
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(null, 204);
    }
}