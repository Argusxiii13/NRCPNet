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
use App\Http\Controllers\api\CalendarScheduleController;
use App\Http\Controllers\Api\ResourcesLinkController;

Route::apiResource('suggestion', SuggestionController::class);

Route::apiResource('divisions', DivisionController::class);

Route::apiResource('roles', RoleController::class);

Route::apiResource('users', UserController::class);

Route::apiResource('features', FeatureController::class);

Route::apiResource('downloadables', DownloadableController::class);

Route::apiResource('announcements', AnnouncementController::class);

Route::get('paginated/announcements', [PaginatedController::class, 'getAnnouncementsPaginated']);

Route::get('paginated/features', [PaginatedController::class, 'getFeaturesPaginated']);

Route::get('paginated/suggestions', [PaginatedController::class, 'getSuggestionsPaginated']);

Route::get('paginated/resources', [PaginatedController::class, 'getResourcesPaginated']);

Route::apiResource('calendar', CalendarScheduleController::class);

Route::get('calendar/date/{date}', [CalendarScheduleController::class, 'getEventsByDate']);

Route::get('wellness-activities', [CalendarScheduleController::class, 'getWellnessActivities']);

Route::prefix('resources')->group(function () {
    Route::get('/', [ResourcesLinkController::class, 'index']);
    Route::post('/', [ResourcesLinkController::class, 'store']);
    Route::put('/{id}', [ResourcesLinkController::class, 'update']);
    Route::delete('/{id}', [ResourcesLinkController::class, 'destroy']);
});
