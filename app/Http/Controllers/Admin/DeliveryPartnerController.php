<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryPartner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryPartnerController extends Controller
{
  public function index()
  {
    $deliveryPartners = DeliveryPartner::orderBy('created_at', 'desc')->get();

    return Inertia::render('Admin/DeliveryPartner/Index', [
      'deliveryPartners' => $deliveryPartners
    ]);
  }

  public function create()
  {
    return Inertia::render('Admin/DeliveryPartner/Create');
  }

  public function store(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'phone' => 'required|string|unique:delivery_partners,phone',
      'email' => 'nullable|email|unique:delivery_partners,email',
      'vehicle_type' => 'nullable|string|max:255',
      'license_number' => 'nullable|string|max:255',
    ]);

    $deliveryPartner = DeliveryPartner::create([
      'name' => $request->name,
      'phone' => $request->phone,
      'email' => $request->email,
      'vehicle_type' => $request->vehicle_type,
      'license_number' => $request->license_number,
      'rating' => 5.0,
      'is_online' => false,
    ]);

    return redirect()->route('admin.delivery-partners.index')
      ->with('success', 'Delivery partner created successfully!');
  }

  public function show(DeliveryPartner $deliveryPartner)
  {
    return Inertia::render('Admin/DeliveryPartner/Show', [
      'deliveryPartner' => $deliveryPartner
    ]);
  }

  public function edit(DeliveryPartner $deliveryPartner)
  {
    return Inertia::render('Admin/DeliveryPartner/Edit', [
      'deliveryPartner' => $deliveryPartner
    ]);
  }

  public function update(Request $request, DeliveryPartner $deliveryPartner)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'phone' => 'required|string|unique:delivery_partners,phone,' . $deliveryPartner->id,
      'email' => 'nullable|email|unique:delivery_partners,email,' . $deliveryPartner->id,
      'vehicle_type' => 'nullable|string|max:255',
      'license_number' => 'nullable|string|max:255',
    ]);

    $deliveryPartner->update([
      'name' => $request->name,
      'phone' => $request->phone,
      'email' => $request->email,
      'vehicle_type' => $request->vehicle_type,
      'license_number' => $request->license_number,
    ]);

    return redirect()->route('admin.delivery-partners.index')
      ->with('success', 'Delivery partner updated successfully!');
  }

  public function destroy(DeliveryPartner $deliveryPartner)
  {
    $deliveryPartner->delete();

    return redirect()->route('admin.delivery-partners.index')
      ->with('success', 'Delivery partner deleted successfully!');
  }

  public function toggleOnlineStatus(DeliveryPartner $deliveryPartner)
  {
    $deliveryPartner->update([
      'is_online' => !$deliveryPartner->is_online
    ]);

    return response()->json([
      'success' => true,
      'message' => 'Online status updated successfully!',
      'is_online' => $deliveryPartner->is_online
    ]);
  }
}
