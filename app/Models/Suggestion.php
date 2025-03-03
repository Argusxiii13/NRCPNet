<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suggestion extends Model
{
    protected $table = 'suggestion';
    protected $fillable = [
        'division',
        'section',
        'content',
        'status',
        'assignee',
        'adminnote',
    ];
}