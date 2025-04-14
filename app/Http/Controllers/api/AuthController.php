<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        $remember = $request->boolean('remember');
    
        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            
            // Get the authenticated user
            $user = Auth::user();
            
            // Store additional user data in the session
            session([
                'user_role' => $user->role,
                'user_division' => $user->division,
                'user_position' => $user->position,
                'user_section' => $user->section
            ]);
            
            return response()->json([
                'success' => true,
                'redirect' => '/dashboard',
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'surname' => $user->surname,
                    'email' => $user->email,
                    'role' => $user->role,
                    'division' => $user->division,
                    'position' => $user->position,
                    'section' => $user->section
                ]
            ]);
        }
    
        return response()->json([
            'message' => 'The provided credentials do not match our records.'
        ], 422);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        // Return JSON response when requested via API
        if ($request->expectsJson() || $request->ajax() || $request->wantsJson()) {
            return response()->json(['message' => 'Logged out successfully']);
        }
        
        // Redirect for regular requests
        return redirect('/');
    }

    // Improved auth check method
    public function check(Request $request)
    {
        // This works for both web and API requests
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'surname' => $user->surname,
                    'email' => $user->email,
                    'role' => session('user_role', $user->role),
                    'division' => session('user_division', $user->division),
                    'position' => session('user_position', $user->position),
                    'section' => session('user_section', $user->section)
                ]
            ]);
        }
        
        return response()->json(['authenticated' => false], 401);
    }
}