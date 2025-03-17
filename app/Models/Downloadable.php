<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Downloadable extends Model
{
    use HasFactory;

    // Specify the table if it's not the plural form of the model name
    protected $table = 'downloadable';

    // Specify the fillable properties
    protected $fillable = [
        'title',
        'content', // This will store the image path
        'author',
        'status', // Added status to fillable properties
    ];
}