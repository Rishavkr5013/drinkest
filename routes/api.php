<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserLocationController;
use Illuminate\Support\Facades\Route;

Route::post('/user-location/check-radius', [UserLocationController::class, 'checkRadius']);
Route::get('/products', [ProductController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/user-locations', [UserLocationController::class, 'store']);

