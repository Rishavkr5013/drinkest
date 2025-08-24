<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
  /**
   * Display a listing of products for admin
   */
  public function index()
  {
    $products = Product::with('store')
      ->latest()
      ->get();

    return Inertia::render('Admin/Product/Index', [
      'products' => $products,
    ]);
  }

  /**
   * Show the form for creating a new product
   */
  public function create()
  {
    $stores = Store::select('id', 'name')->get();

    return Inertia::render('Admin/Product/Create', [
      'stores' => $stores,
    ]);
  }

  /**
   * Store a newly created product
   */
  public function store(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'description' => 'nullable|string',
      'price' => 'required|numeric|min:0',
      'category' => 'required|string|max:100',
      'store_id' => 'required|exists:stores,id',
      'is_available' => 'boolean',
    ]);

    Product::create([
      'name' => $request->name,
      'description' => $request->description,
      'price' => $request->price,
      'category' => $request->category,
      'store_id' => $request->store_id,
      'is_available' => $request->boolean('is_available', true),
    ]);

    return redirect()->route('admin.products.index')
      ->with('success', 'Product created successfully.');
  }

  /**
   * Display the specified product
   */
  public function show(Product $product)
  {
    $product->load('store');

    return Inertia::render('Admin/Product/Show', [
      'product' => $product,
    ]);
  }

  /**
   * Show the form for editing the specified product
   */
  public function edit(Product $product)
  {
    $stores = Store::select('id', 'name')->get();
    $product->load('store');

    return Inertia::render('Admin/Product/Edit', [
      'product' => $product,
      'stores' => $stores,
    ]);
  }

  /**
   * Update the specified product
   */
  public function update(Request $request, Product $product)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'description' => 'nullable|string',
      'price' => 'required|numeric|min:0',
      'category' => 'required|string|max:100',
      'store_id' => 'required|exists:stores,id',
      'is_available' => 'boolean',
    ]);

    $product->update([
      'name' => $request->name,
      'description' => $request->description,
      'price' => $request->price,
      'category' => $request->category,
      'store_id' => $request->store_id,
      'is_available' => $request->boolean('is_available'),
    ]);

    return redirect()->route('admin.products.index')
      ->with('success', 'Product updated successfully.');
  }

  /**
   * Remove the specified product
   */
  public function destroy(Product $product)
  {
    $product->delete();

    return redirect()->back()
      ->with('success', 'Product deleted successfully.');
  }

  /**
   * Toggle product availability
   */
  public function toggleAvailability(Product $product)
  {
    $product->update([
      'is_available' => !$product->is_available
    ]);

    $status = $product->is_available ? 'available' : 'unavailable';

    return redirect()->back()
      ->with('success', "Product marked as {$status}.");
  }
}
