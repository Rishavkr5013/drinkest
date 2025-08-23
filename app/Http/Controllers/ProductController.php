<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('store');

        if ($request->has('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        return $query->paginate(10);
    }
}
