<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\FirebaseAuthController;
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
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users.index');
    Route::get('/store', [AdminController::class, 'store'])->name('admin.stores.index');
    Route::get('/orders', [AdminController::class, 'orders'])->name('admin.orders.index');
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
