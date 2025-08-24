<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class GeoService
{
  public function geocode(string $address): ?array
  {
    $res = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
      'address' => $address,
      'key' => config('services.google.maps_server_key', env('GOOGLE_MAPS_SERVER_API_KEY')),
    ])->json();

    if (empty($res['results'][0]['geometry']['location'])) return null;
    $loc = $res['results'][0]['geometry']['location'];
    return ['lat' => $loc['lat'], 'lng' => $loc['lng']];
  }

  public function pointSql(float $lat, float $lng): string
  {
    // Note: lng, lat order for ST_MakePoint
    return "ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography";
  }

  public function distanceMeters(float $latA, float $lngA, float $latB, float $lngB): float
  {
    $row = DB::selectOne("
            SELECT ST_Distance(
                ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography,
                ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography
            ) AS d
        ", [$lngA, $latA, $lngB, $latB]);
    return (float)$row->d;
  }
}
