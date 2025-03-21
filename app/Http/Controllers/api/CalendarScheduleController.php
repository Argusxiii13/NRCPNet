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
}