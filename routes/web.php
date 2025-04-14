<?php
// In your routes/web.php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\api\AuthController;

Route::get('/', function () {
    return view('landing', [
        'isLoggedIn' => Auth::check()
    ]);
});

// Change this in your web.php
Route::get('/login', function () {
    // If user is already logged in, redirect to dashboard
    if (Auth::check()) {
        return redirect('/dashboard');
    }
    
    // Otherwise show the login page
    return view('login');
})->name('login');

// Login and logout routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected route with auth middleware
Route::get('/dashboard', function () {
    return view('admin');
})->middleware('auth');

// Add this route for checking auth status from any page
Route::get('/check-auth', [AuthController::class, 'check']);
// Add this to your web.php file
Route::get('/auth/user', function (Request $request) {
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
});