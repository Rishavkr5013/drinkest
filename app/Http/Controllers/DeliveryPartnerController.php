<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryPartnerController extends Controller
{
    public function dashboard()
    {
        $deliveryPartner = auth()->guard('delivery_partner')->user();

        // Get assigned orders
        $assignedOrders = $deliveryPartner->assignments()
            ->whereIn('status', ['assigned', 'picked_up'])
            ->with(['order.user', 'order.store', 'order.location', 'order.items.product'])
            ->orderBy('assigned_at', 'desc')
            ->get();

        // Get completed orders for stats
        $completedOrdersCount = $deliveryPartner->assignments()
            ->where('status', 'delivered')
            ->count();

        return Inertia::render('DeliveryPartner/Dashboard', [
            'auth' => [
                'deliveryPartner' => $deliveryPartner
            ],
            'assignedOrders' => $assignedOrders,
            'stats' => [
                'completedOrders' => $completedOrdersCount,
                'activeOrders' => $assignedOrders->count(),
            ]
        ]);
    }

    public function updateOrderStatus(Request $request)
    {
        $request->validate([
            'assignment_id' => 'required|exists:order_assignments,id',
            'status' => 'required|in:picked_up,delivered',
            'notes' => 'nullable|string|max:500'
        ]);

        $deliveryPartner = auth()->guard('delivery_partner')->user();
        $assignment = $deliveryPartner->assignments()->findOrFail($request->assignment_id);

        // Update assignment status
        $updateData = [
            'status' => $request->status,
            'notes' => $request->notes
        ];

        if ($request->status === 'picked_up') {
            $updateData['picked_up_at'] = now();
            // Update order status to dispatched
            $assignment->order->update(['status' => 'dispatched']);
        } elseif ($request->status === 'delivered') {
            $updateData['delivered_at'] = now();
            // Update order status to delivered
            $assignment->order->update(['status' => 'delivered']);
        }

        $assignment->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully'
        ]);
    }

    public function toggleOnlineStatus()
    {
        $deliveryPartner = auth()->guard('delivery_partner')->user();

        $deliveryPartner->update([
            'is_online' => !$deliveryPartner->is_online
        ]);

        return response()->json([
            'success' => true,
            'is_online' => $deliveryPartner->is_online,
            'message' => $deliveryPartner->is_online ? 'You are now online' : 'You are now offline'
        ]);
    }
}
