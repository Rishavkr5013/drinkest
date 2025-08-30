<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\DeliveryPartner;
use App\Models\OrderAssignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'store', 'location', 'items.product', 'assignment.deliveryPartner'])
            ->latest()
            ->get();

        $availablePartners = DeliveryPartner::where('is_online', true)
            ->whereDoesntHave('activeAssignments')
            ->get();

        return Inertia::render('Admin/Order/Index', [
            'orders' => $orders,
            'availablePartners' => $availablePartners,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,assigned,dispatched,delivered,cancelled'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function assignDeliveryPartner(Request $request, Order $order)
    {
        $request->validate([
            'delivery_partner_id' => 'required|exists:delivery_partners,id'
        ]);

        // Check if order is already assigned
        if ($order->assignment) {
            return redirect()->back()->with('error', 'Order is already assigned to a delivery partner.');
        }

        // Check if delivery partner is available
        $deliveryPartner = DeliveryPartner::find($request->delivery_partner_id);
        if (!$deliveryPartner->is_online || $deliveryPartner->isBusy()) {
            return redirect()->back()->with('error', 'Selected delivery partner is not available.');
        }

        // Create assignment
        OrderAssignment::create([
            'order_id' => $order->id,
            'delivery_partner_id' => $request->delivery_partner_id,
            'assigned_by' => $request->user()->id,
            'status' => 'assigned',
            'assigned_at' => now()
        ]);

        // Update order status
        $order->update([
            'status' => 'assigned',
            'delivery_partner_id' => $request->delivery_partner_id
        ]);

        return redirect()->back()->with('success', 'Order assigned to delivery partner successfully.');
    }

    public function unassignDeliveryPartner(Order $order)
    {
        if (!$order->assignment) {
            return redirect()->back()->with('error', 'Order is not assigned to any delivery partner.');
        }

        // Delete assignment
        $order->assignment->delete();

        // Update order status back to confirmed
        $order->update([
            'status' => 'confirmed',
            'delivery_partner_id' => null
        ]);

        return redirect()->back()->with('success', 'Order unassigned from delivery partner.');
    }
}
