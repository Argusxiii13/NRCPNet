<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\SuggestionController;
use App\Http\Controllers\api\DivisionController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/suggestion', [SuggestionController::class, 'store']);

Route::get('/divisions', [DivisionController::class, 'index']);

Route::apiResource('divisions', DivisionController::class);
