<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\StoreController as AdminStoreController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\FirebaseAuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use Inertia\Inertia;

//auth routes
Route::post('/firebase-login', [FirebaseAuthController::class, 'login']);

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::post('/user-locations', [LocationController::class, 'store']);
});


Route::prefix('stores')->group(function () {
    Route::get('/', [StoreController::class, 'index']); // list all stores
    Route::post('/', [StoreController::class, 'store']); // add new store
    Route::get('/{store}', [StoreController::class, 'show']); // get one store
    Route::get('/create', [StoreController::class, 'create']);
});

Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index']); // list all orders
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // User management routes
    Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('admin.users.show');
    Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus'])->name('admin.users.updateStatus');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');

    // Store management routes
    Route::get('/stores', [AdminStoreController::class, 'index'])->name('admin.stores.index');
    Route::post('/stores', [AdminStoreController::class, 'store'])->name('admin.stores.store');
    Route::patch('/stores/{store}', [AdminStoreController::class, 'update'])->name('admin.stores.update');
    Route::delete('/stores/{store}', [AdminStoreController::class, 'destroy'])->name('admin.stores.destroy');

    // Product management routes
    Route::get('/products', [AdminProductController::class, 'index'])->name('admin.products.index');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('admin.products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('admin.products.store');
    Route::get('/products/{product}', [AdminProductController::class, 'show'])->name('admin.products.show');
    Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('admin.products.edit');
    Route::patch('/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');
    Route::patch('/products/{product}/toggle-availability', [AdminProductController::class, 'toggleAvailability'])->name('admin.products.toggleAvailability');
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');

    // Order management routes
    Route::get('/orders', [OrderController::class, 'index'])->name('admin.orders.index');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');
});



Route::middleware(['auth'])->group(function () {
    // Products page for a given store
    Route::get('/store/{store}/products', function ($storeId) {
        return Inertia::render('ProductList', [
            'storeId' => (int) $storeId,
        ]);
    })->name('store.products');
});

require __DIR__ . '/auth.php';
