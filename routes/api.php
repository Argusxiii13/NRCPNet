<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\SuggestionController;
use App\Http\Controllers\api\DivisionController;
use App\Http\Controllers\api\RoleController; // Import RoleController

// Suggestion routes
Route::post('/suggestion', [SuggestionController::class, 'store']);

// Division routes
Route::apiResource('divisions', DivisionController::class);

// Role routes
Route::apiResource('roles', RoleController::class); // Add this line for RoleController