<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $table = 'divisions';

    protected $fillable = [
        'code',
        'name',
        'has_sections',
    ];

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}