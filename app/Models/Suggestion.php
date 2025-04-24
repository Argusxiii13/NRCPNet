<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class Suggestion extends Model
{
    use HasFactory, Notifiable;
    protected $table = 'suggestion';
    protected $fillable = [
        'division',
        'section',
        'content',
        'status',
        'adminnote',
    ];
}