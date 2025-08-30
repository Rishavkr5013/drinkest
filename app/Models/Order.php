<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

    protected $fillable = ['user_id', 'store_id', 'user_location_id', 'status', 'total_amount', 'delivery_partner_id'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function location()
    {
        return $this->belongsTo(UserLocation::class, 'user_location_id');
    }

    public function deliveryPartner()
    {
        return $this->belongsTo(DeliveryPartner::class);
    }

    public function assignment()
    {
        return $this->hasOne(OrderAssignment::class);
    }

    public function isAssigned()
    {
        return $this->assignment !== null;
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isConfirmed()
    {
        return $this->status === 'confirmed';
    }

    public function isAssignedStatus()
    {
        return $this->status === 'assigned';
    }

    public function isDispatched()
    {
        return $this->status === 'dispatched';
    }

    public function isDelivered()
    {
        return $this->status === 'delivered';
    }
}
