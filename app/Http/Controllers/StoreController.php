<?php


namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * List all stores
     */
    public function index()
    {
        return response()->json(Store::all());
    }

    /**
     * Create a new store
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'delivery_radius' => 'nullable|integer|min:1000', // in meters
        ]);

        $deliveryRadius = $request->input('delivery_radius', 5000);

        $store = Store::create([
            'name' => $request->name,
            'address' => $request->address,
            'delivery_radius' => $deliveryRadius,
            'location' => DB::raw("ST_SetSRID(ST_MakePoint({$request->longitude}, {$request->latitude}), 4326)::geography")
        ]);

        return response()->json([
            'message' => 'Store created successfully',
            'store' => $store
        ], 201);
    }

    /**
     * Get a specific store
     */
    public function show(Store $store)
    {
        return response()->json($store);
    }

    public function create()
    {
        return Inertia::render('Stores/Create');
    }
}
