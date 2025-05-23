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
use App\Http\Controllers\Api\AuthController;

// Fallback for any other API routes
Route::fallback(function() {
    return response()->json(['message' => 'API endpoint not found'], 404);
});

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

// In your api.php routes file
Route::get('active-announcements', [AnnouncementController::class, 'activeAnnouncements']);

Route::get('user/current', [UserController::class, 'getCurrentUser']);

// Standard Laravel user endpoint - this works with Sanctum by default
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Your custom user-session endpoint
Route::middleware('auth:sanctum')->get('/user-session', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,
        'first_name' => $request->user()->first_name,
        'surname' => $request->user()->surname,
        'email' => $request->user()->email,
        'role' => session('user_role', $request->user()->role),
        'division' => session('user_division', $request->user()->division),
        'position' => session('user_position', $request->user()->position),
        'section' => session('user_section', $request->user()->section)
    ]);
});

// Auth check endpoint
Route::get('/auth/check', [AuthController::class, 'check']);

Route::get('/calendar-filtered', [App\Http\Controllers\api\CalendarScheduleController::class, 'getFilteredEvents']);

// Add this to your routes/api.php file
Route::get('/forms-by-type', [App\Http\Controllers\api\DownloadableController::class, 'getAllFormsByType']);

// Add this to your routes/api.php file
Route::put('/downloadables/update-form/{id}', [DownloadableController::class, 'updateForm']);

Route::post('/downloadables/with-metadata', [App\Http\Controllers\api\DownloadableController::class, 'storeWithMetadata']);
// Add this new route
Route::get('/forms-by-division', [DownloadableController::class, 'getFormsByDivision']);