<?php

namespace App\Http\Controllers;

use App\Models\UserLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\GeoService;

class UserLocationController extends Controller
{
    protected $geo;

    public function __construct(GeoService $geo)
    {
        $this->geo = $geo;
    }

    public function checkRadius(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'store_id' => 'required|exists:stores,id',
        ]);

        $lat = $request->latitude;
        $lng = $request->longitude;
        $store = DB::table('stores')->where('id', $request->store_id)->first();

        $within = DB::selectOne("
        SELECT ST_DWithin(
            ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography,
            s.location,
            s.delivery_radius
        ) AS within_radius
        FROM stores s
        WHERE s.id = ?
    ", [$lng, $lat, $store->id]);

        if (!$within || !$within->within_radius) {
            return response()->json([
                'allowed' => false,
                'message' => 'This address is outside the delivery area.'
            ], 403);
        }

        return response()->json([
            'allowed' => true,
            'message' => 'Address is within delivery area.',
            'latitude' => $lat,
            'longitude' => $lng
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        \Log::info("check at lien 64----> " . $request->address . " " . $request->latitude . " " . $request->longitude);

        $location = UserLocation::create([
            'user_id' => auth()->id() ?? 1, // logged in user
            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Location saved successfully',
            'location' => $location
        ]);
    }
}
