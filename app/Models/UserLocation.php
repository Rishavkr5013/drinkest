<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLocation extends Model
{
    protected $fillable = [
        'user_id',
        'address',
        'house_name_or_number',
        'road_name',
        'landmark',
        'address_type',
        'location'
    ];

    protected $casts = []; // geog stays raw; query with SQL

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get formatted address for display
     */
    public function getFormattedAddressAttribute()
    {
        if ($this->house_name_or_number || $this->road_name) {
            $parts = array_filter([
                $this->house_name_or_number,
                $this->road_name,
                $this->landmark ? "Near {$this->landmark}" : null,
            ]);
            return implode(', ', $parts);
        }

        return $this->address;
    }
}
