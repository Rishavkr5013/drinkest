<?php

namespace App\Http\Middleware;

use App\Models\Store;
use App\Models\UserLocation;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CheckDeliveryRadius
{

    public function handle(Request $request, Closure $next): Response
    {
        // Validate required inputs exist
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'user_location_id' => 'required|exists:user_locations,id',
        ]);

        $store = Store::findOrFail($request->store_id);
        $userLocation = UserLocation::findOrFail($request->user_location_id);

        // Check if within 5 km using PostGIS ST_DWithin
        $withinRadius = DB::selectOne("
            SELECT ST_DWithin(
                s.location,
                u.location,
                5000  -- meters (5 km)
            ) AS within_radius
            FROM stores s, user_locations u
            WHERE s.id = ? AND u.id = ?
        ", [$store->id, $userLocation->id]);

        if (!$withinRadius || !$withinRadius->within_radius) {
            return response()->json([
                'message' => 'Sorry, this address is outside the 5 km delivery zone.'
            ], 422);
        }

        // Continue request
        return $next($request);
    }
}
