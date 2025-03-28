<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourcesLink extends Model
{
    use HasFactory;

    protected $table = 'resources_link';

    protected $fillable = [
        'name',
        'icon',
        'link',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
}