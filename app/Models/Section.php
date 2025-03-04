<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $table = 'sections';

    protected $fillable = [
        'name',
        'division_id',
    ];

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}