<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderAssignment extends Model
{
    protected $fillable = [
        'order_id',
        'delivery_partner_id',
        'assigned_by',
        'status',
        'assigned_at',
        'picked_up_at',
        'delivered_at',
        'notes'
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'picked_up_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function deliveryPartner()
    {
        return $this->belongsTo(DeliveryPartner::class);
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    // Status helpers
    public function isAssigned()
    {
        return $this->status === 'assigned';
    }

    public function isPickedUp()
    {
        return $this->status === 'picked_up';
    }

    public function isDelivered()
    {
        return $this->status === 'delivered';
    }

    public function markAsPickedUp()
    {
        $this->update([
            'status' => 'picked_up',
            'picked_up_at' => now()
        ]);
    }

    public function markAsDelivered()
    {
        $this->update([
            'status' => 'delivered',
            'delivered_at' => now()
        ]);

        // Update the main order status
        $this->order->update(['status' => 'delivered']);
    }
}
