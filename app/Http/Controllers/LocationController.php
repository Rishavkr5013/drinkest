<?php

use App\Models\UserLocation;
use App\Services\GeoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LocationController extends Controller
{
    public function store(Request $request, GeoService $geo)
    {
        $validated = $request->validate(['address' => 'required|string|max:255']);

        $coords = $geo->geocode($validated['address']);
        if (!$coords) {
            return response()->json(['error' => 'Unable to geocode address'], 422);
        }

        $shopLat = config('store.lat');
        $shopLng = config('store.lng');
        $distance = $geo->distanceMeters($coords['lat'], $coords['lng'], $shopLat, $shopLng);

        if ($distance > config('store.delivery_radius_m')) {
            return response()->json([
                'error' => 'We only deliver within 5 km',
                'distance_km' => round($distance / 1000, 2)
            ], 403);
        }

        $loc = new UserLocation([
            'user_id' => Auth::id(),
            'address' => $validated['address'],
            'location' => DB::raw($geo->pointSql($coords['lat'], $coords['lng']))
        ]);
        $loc->save();

        return response()->json([
            'message' => 'Location saved',
            'distance_km' => round($distance / 1000, 2),
            'id' => $loc->id
        ]);
    }
}
