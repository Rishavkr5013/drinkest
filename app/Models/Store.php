<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = [
        'name',
        'address',
        'location',
        'delivery_radius',
    ];

    // Don't cast location - it's a PostGIS geography column handled by raw SQL
}
