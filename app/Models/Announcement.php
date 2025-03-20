<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Announcement extends Model
{
    use HasFactory;

    // Specify the table if it's not the plural form of the model name
    protected $table = 'announcements';

    // Specify the fillable properties
    protected $fillable = [
        'title',
        'type', //this will store the stuff whether its image or html
        'content', // This will store the image or html path
        'author',
        'status', // Added status to fillable properties
    ];
}