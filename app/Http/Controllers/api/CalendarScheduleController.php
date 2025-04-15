<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CalendarSchedule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log; // Add this line

class CalendarScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->has('month')) {
            $dateString = $request->month; // "Mar-2025"
            Log::debug('Date string received: ' . $dateString);
            
            try {
                // Split the date string
                list($monthStr, $yearStr) = explode('-', $dateString);
                
                // Convert month name to number (Mar -> 3)
                $monthNum = date('m', strtotime("1 $monthStr"));
                
                Log::debug('Parsed month: ' . $monthNum);
                Log::debug('Parsed year: ' . $yearStr);
                
                // Query the database
                $events = CalendarSchedule::whereMonth('date', $monthNum)
                    ->whereYear('date', $yearStr)
                    ->get();
                    
                Log::debug('Events count: ' . $events->count());
// Just return all events to confirm data access works
$events = CalendarSchedule::all();
return response()->json($events);
            } catch (\Exception $e) {
                Log::error('Date parsing error: ' . $e->getMessage());
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            $events = CalendarSchedule::all();
            Log::debug('All events count: ' . $events->count());
            return response()->json($events);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $event = CalendarSchedule::findOrFail($id);
        
        return response()->json($event);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'type' => 'required|string|max:50',
                'date' => 'required|date',
                'time' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'division' => 'required|string|max:50', // Added division validation
            ]);
            
            // Format the time by combining start and end times
            if ($request->has('startTime') && $request->has('endTime')) {
                $validated['time'] = $request->startTime . ' - ' . $request->endTime;
            }
            
            $event = CalendarSchedule::create($validated);
            
            Log::debug('Event created: ' . $event->id);
            return response()->json($event, 201);
        } catch (\Exception $e) {
            Log::error('Event creation error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $event = CalendarSchedule::findOrFail($id);
            
            $validated = $request->validate([
                'title' => 'string|max:255',
                'type' => 'string|max:50',
                'date' => 'date',
                'time' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'division' => 'string|max:50', // Added division validation
            ]);
            
            // Format the time by combining start and end times
            if ($request->has('startTime') && $request->has('endTime')) {
                $validated['time'] = $request->startTime . ' - ' . $request->endTime;
            }
            
            $event->update($validated);
            
            Log::debug('Event updated: ' . $event->id);
            return response()->json($event);
        } catch (\Exception $e) {
            Log::error('Event update error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $event = CalendarSchedule::findOrFail($id);
            $event->delete();
            
            Log::debug('Event deleted: ' . $id);
            return response()->json(['message' => 'Event deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Event deletion error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get events for a specific date.
     *
     * @param  string  $date
     * @return \Illuminate\Http\Response
     */
    public function getEventsByDate($date)
    {
        try {
            $events = CalendarSchedule::whereDate('date', $date)->get();
            
            Log::debug('Events for date ' . $date . ': ' . $events->count());
            return response()->json($events);
        } catch (\Exception $e) {
            Log::error('Get events by date error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Get wellness activities for the current week
     *
     * @return \Illuminate\Http\Response
     */
    public function getWellnessActivities()
    {
        try {
            // Get the start and end of the current week
            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();

            // Fetch wellness activities for the current week
            $activities = CalendarSchedule::where('type', 'wellness')
                ->whereBetween('date', [$startOfWeek, $endOfWeek])
                ->get();

            Log::debug('Wellness activities found: ' . $activities->count());
            return response()->json($activities);
        } catch (\Exception $e) {
            Log::error('Wellness activities fetch error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get events filtered by month and division.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getFilteredEvents(Request $request)
    {
        try {
            $query = CalendarSchedule::query();
            
            // Filter by month if provided
            if ($request->has('month')) {
                $dateString = $request->month; // "Mar-2025"
                Log::debug('Filtered date string received: ' . $dateString);
                
                // Split the date string
                list($monthStr, $yearStr) = explode('-', $dateString);
                
                // Convert month name to number (Mar -> 3)
                $monthNum = date('m', strtotime("1 $monthStr"));
                
                Log::debug('Filtered parsed month: ' . $monthNum);
                Log::debug('Filtered parsed year: ' . $yearStr);
                
                $query->whereMonth('date', $monthNum)
                      ->whereYear('date', $yearStr);
            }
            
            // Filter by division
            if ($request->has('division')) {
                $divisions = explode(',', $request->division);
                
                // Always include "General" events plus the user's division events
                $query->where(function($q) use ($divisions) {
                    $q->whereIn('division', $divisions)
                      ->orWhere('division', 'General');
                });
                
                Log::debug('Filtering by divisions: ' . implode(', ', $divisions) . ' and General');
            } else {
                // If no division specified, only show General events
                $query->where('division', 'General');
                Log::debug('Filtering by General division only');
            }
            
            $events = $query->get();
            Log::debug('Filtered events count: ' . $events->count());
            
            return response()->json($events);
        } catch (\Exception $e) {
            Log::error('Filtered event fetch error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}