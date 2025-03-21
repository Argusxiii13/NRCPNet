<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\SuggestionController;
use App\Http\Controllers\api\DivisionController;
use App\Http\Controllers\api\RoleController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\FeatureController;
use App\Http\Controllers\api\DownloadableController;
use App\Http\Controllers\api\AnnouncementController;
use App\Http\Controllers\api\PaginatedController;


Route::apiResource('suggestion', SuggestionController::class);

Route::apiResource('divisions', DivisionController::class);

Route::apiResource('roles', RoleController::class);

Route::apiResource('users', UserController::class);

Route::apiResource('features', FeatureController::class);

Route::apiResource('downloadables', DownloadableController::class);

Route::apiResource('announcements', AnnouncementController::class);

Route::get('paginated/announcements', [PaginatedController::class, 'getAnnouncementsPaginated']);