<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLocation extends Model
{
    protected $fillable = ['user_id', 'address', 'location'];
    protected $casts = []; // geog stays raw; query with SQL

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
