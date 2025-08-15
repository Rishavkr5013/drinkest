<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\FirebaseAuthController;

Route::prefix('v1')->group(function () {
  Route::post('/auth/firebase/login', [FirebaseAuthController::class, 'login']);
  Route::post('/auth/firebase/logout', [FirebaseAuthController::class, 'logout'])->middleware('auth:sanctum');
});
