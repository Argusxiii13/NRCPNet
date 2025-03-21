<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarSchedule extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date',
        'type',
        'title',
        'time',
        'location',
        'description',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array
     */

}