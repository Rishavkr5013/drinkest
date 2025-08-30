<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class DeliveryPartner extends Authenticatable
{
    protected $table = 'delivery_partners';
    protected $fillable = [
        'name',
        'phone',
        'email',
        'vehicle_type',
        'license_number',
        'rating',
        'is_online',
        'latitude',
        'longitude',
        'firebase_uid'
    ];

    // Since we're using phone authentication, we don't need password fields
    protected $hidden = [
        'firebase_uid'
    ];

    // Override the username field to use phone instead of email
    public function getAuthIdentifierName()
    {
        return 'phone';
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function assignments()
    {
        return $this->hasMany(OrderAssignment::class);
    }

    public function activeAssignments()
    {
        return $this->assignments()
            ->whereIn('status', ['assigned', 'picked_up'])
            ->with('order');
    }

    public function isBusy()
    {
        return $this->activeAssignments()->exists();
    }

    public function setOnline()
    {
        $this->update(['is_online' => true]);
    }

    public function setOffline()
    {
        $this->update(['is_online' => false]);
    }
}
