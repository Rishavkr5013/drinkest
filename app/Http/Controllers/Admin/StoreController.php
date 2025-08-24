<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Services\GeoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StoreController extends Controller
{
  /**
   * Display a listing of stores for admin
   */
  public function index()
  {
    $stores = Store::select([
      'id',
      'name',
      'address',
      'delivery_radius',
      'created_at',
      'updated_at',
      DB::raw('ST_X(location::geometry) as longitude'),
      DB::raw('ST_Y(location::geometry) as latitude')
    ])->get();

    return Inertia::render('Admin/Store/Index', [
      'stores' => $stores,
    ]);
  }

  /**
   * Store a newly created store
   */
  public function store(Request $request, GeoService $geoService)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'address' => 'required|string|max:500',
      'delivery_radius' => 'required|integer|min:500|max:50000', // 500m to 50km
    ]);

    // Geocode the address to get coordinates
    $coordinates = $geoService->geocode($request->address);

    if (!$coordinates) {
      return redirect()->back()
        ->withErrors(['address' => 'Unable to find coordinates for the provided address. Please verify the address is complete and correct.'])
        ->withInput();
    }

    // Store::create([
    //   'name' => $request->name,
    //   'address' => $request->address,
    //   'delivery_radius' => $request->delivery_radius,
    //   'location' => DB::raw("ST_SetSRID(ST_MakePoint({$request->longitude}, {$request->latitude}), 4326)::geography")
    // ]);

    Store::create([
      'name' => $request->name,
      'address' => $request->address,
      'delivery_radius' => $request->delivery_radius,
      'location' => DB::raw("ST_SetSRID(ST_MakePoint({$coordinates['lng']}, {$coordinates['lat']}), 4326)::geography"),
    ]);


    return redirect()->back()->with('success', 'Store created successfully with coordinates automatically detected.');
  }

  /**
   * Update the specified store
   */
  public function update(Request $request, Store $store, GeoService $geoService)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'address' => 'required|string|max:500',
      'delivery_radius' => 'required|integer|min:500|max:50000',
    ]);

    // Only geocode if address has changed
    $coordinates = null;
    if ($request->address !== $store->address) {
      $coordinates = $geoService->geocode($request->address);

      if (!$coordinates) {
        return redirect()->back()
          ->withErrors(['address' => 'Unable to find coordinates for the provided address. Please verify the address is complete and correct.'])
          ->withInput();
      }
    }

    $updateData = [
      'name' => $request->name,
      'address' => $request->address,
      'delivery_radius' => $request->delivery_radius,
    ];

    // Only update location if we have new coordinates
    if ($coordinates) {
      $updateData['location'] = DB::raw("ST_SetSRID(ST_MakePoint({$coordinates['lng']}, {$coordinates['lat']}), 4326)::geography");
    }

    $store->update($updateData);

    $message = $coordinates
      ? 'Store updated successfully with new coordinates automatically detected.'
      : 'Store updated successfully.';

    return redirect()->back()->with('success', $message);
  }

  /**
   * Remove the specified store
   */
  public function destroy(Store $store)
  {
    $store->delete();

    return redirect()->back()->with('success', 'Store deleted successfully.');
  }
}
