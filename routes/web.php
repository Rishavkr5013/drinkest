<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DeliveryPartnerController as AdminDeliveryPartnerController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\StoreController as AdminStoreController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\FirebaseAuthController;
use App\Http\Controllers\DeliveryPartnerAuthController;
use App\Http\Controllers\DeliveryPartnerController;
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
    Route::post('/orders/{order}/assign', [OrderController::class, 'assignDeliveryPartner'])->name('admin.orders.assign');
    Route::delete('/orders/{order}/unassign', [OrderController::class, 'unassignDeliveryPartner'])->name('admin.orders.unassign');

    // Delivery Partner management routes
    Route::get('/delivery-partners', [AdminDeliveryPartnerController::class, 'index'])->name('admin.delivery-partners.index');
    Route::get('/delivery-partners/create', [AdminDeliveryPartnerController::class, 'create'])->name('admin.delivery-partners.create');
    Route::post('/delivery-partners', [AdminDeliveryPartnerController::class, 'store'])->name('admin.delivery-partners.store');
    Route::get('/delivery-partners/{deliveryPartner}', [AdminDeliveryPartnerController::class, 'show'])->name('admin.delivery-partners.show');
    Route::get('/delivery-partners/{deliveryPartner}/edit', [AdminDeliveryPartnerController::class, 'edit'])->name('admin.delivery-partners.edit');
    Route::patch('/delivery-partners/{deliveryPartner}', [AdminDeliveryPartnerController::class, 'update'])->name('admin.delivery-partners.update');
    Route::post('/delivery-partners/{deliveryPartner}/toggle-online', [AdminDeliveryPartnerController::class, 'toggleOnlineStatus'])->name('admin.delivery-partners.toggle-online');
    Route::delete('/delivery-partners/{deliveryPartner}', [AdminDeliveryPartnerController::class, 'destroy'])->name('admin.delivery-partners.destroy');
});



Route::middleware(['auth'])->group(function () {
    // Products page for a given store
    Route::get('/store/{store}/products', function ($storeId) {
        return Inertia::render('ProductList', [
            'storeId' => (int) $storeId,
        ]);
    })->name('store.products');
});


Route::get('/delivery-partner/login', [DeliveryPartnerAuthController::class, 'showLoginForm'])->name('delivery-partner.login');
Route::post('/delivery-partner/login', [DeliveryPartnerAuthController::class, 'login']);
Route::post('/delivery-partner/logout', [DeliveryPartnerAuthController::class, 'logout']);

Route::middleware('auth:delivery_partner')->group(function () {
    Route::get('/delivery-partner/dashboard', [DeliveryPartnerController::class, 'dashboard']);
    Route::post('/delivery-partner/update-order-status', [DeliveryPartnerController::class, 'updateOrderStatus']);
    Route::post('/delivery-partner/toggle-online', [DeliveryPartnerController::class, 'toggleOnlineStatus']);
});


require __DIR__ . '/auth.php';
