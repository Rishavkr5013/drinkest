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

    // Ensure location is cast to array (lat, lng)
    protected $casts = [
        'location' => 'array',
    ];
}
