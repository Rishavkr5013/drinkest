<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\UserLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'store_id' => 'required|exists:stores,id',
    //         'user_location_id' => 'required|exists:user_locations,id',
    //         'items' => 'required|array|min:1',
    //         'items.*.product_id' => 'required|exists:products,id',
    //         'items.*.quantity' => 'required|integer|min:1',
    //     ]);

    //     // ✅ Check delivery radius
    //     $userLocation = UserLocation::findOrFail($request->user_location_id);
    //     $store = Store::findOrFail($request->store_id);

    //     // $within = DB::selectOne("
    //     //     SELECT ST_DWithin(
    //     //         ?::geography,
    //     //         ?::geography,
    //     //         ?
    //     //     ) AS within_radius
    //     // ", [
    //     //     "SRID=4326;POINT($userLocation->longitude $userLocation->latitude)",
    //     //     "SRID=4326;POINT($store->longitude $store->latitude)",
    //     //     $store->delivery_radius
    //     // ]);

    //     // if (!$within || !$within->within_radius) {
    //     //     return response()->json(['error' => 'Address outside delivery radius'], 403);
    //     // }

    //     // ✅ Create order
    //     $order = Order::create([
    //         'user_id' => auth()->id() ?? 1, // must be logged in
    //         'store_id' => $store->id,
    //         'user_location_id' => $userLocation->id,
    //         'status' => 'pending',
    //         'total_amount' => 0, // will calculate below
    //     ]);

    //     $total = 0;
    //     foreach ($request->items as $item) {
    //         $product = Product::findOrFail($item['product_id']);
    //         $price = $product->price;
    //         $total += $price * $item['quantity'];

    //         $order->items()->create([
    //             'product_id' => $product->id,
    //             'quantity' => $item['quantity'],
    //             'price' => $price,
    //         ]);
    //     }

    //     $order->update(['total_amount' => $total]);

    //     return response()->json([
    //         'message' => 'Order created successfully',
    //         'order' => $order->load('items')
    //     ]);
    // }



    public function store(Request $request)
    {
        // $request->validate([
        //     'store_id' => 'required|exists:stores,id',
        //     'user_location_id' => 'required|exists:user_locations,id',
        //     'items' => 'required|array|min:1',
        //     'items.*.product_id' => 'required|exists:products,id',
        //     'items.*.quantity' => 'required|integer|min:1',
        // ]);



        $userLocation = UserLocation::findOrFail($request->user_location_id);
        $store = \App\Models\Store::findOrFail($request->store_id);

        // // Check if address is within delivery radius
        // $within = DB::selectOne("
        //     SELECT ST_DWithin(
        //         ?::geography,
        //         ?::geography,
        //         ?
        //     ) AS within_radius
        // ", [
        //     "SRID=4326;POINT($userLocation->longitude $userLocation->latitude)",
        //     "SRID=4326;POINT($store->longitude $store->latitude)",
        //     $store->delivery_radius
        // ]);

        // if (!$within || !$within->within_radius) {
        //     return response()->json(['error' => 'Address outside delivery radius'], 403);
        // }


        // Create order
        $order = Order::create([
            'user_id' => auth()->id() ?? 1,
            'store_id' => $store->id,
            'user_location_id' => $userLocation->id,
            'status' => 'pending',
            'total_amount' => 0,
        ]);

        $total = 0;
        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $price = $product->price;
            $total += $price * $item['quantity'];

            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $price,
            ]);
        }

        $order->update(['total_amount' => $total]);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items.product', 'store'),
        ]);
    }
}
