<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\api\AuthController;

Route::get('/', function () {
    return view('landing');
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

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected route with auth middleware
Route::get('/dashboard', function () {
    return view('admin');
})->middleware('auth');