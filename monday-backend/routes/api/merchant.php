<?php

use App\Http\Controllers\MerchantController;
use App\Http\Controllers\MerchantProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:manager'])->group(function () {
   Route::get('/merchant', [MerchantController::class, 'index']);
   Route::get('/merchant/{merchant}', [MerchantController::class, 'show']);
   Route::post('/merchant', [MerchantController::class, 'store']);
   Route::put('/merchant/{merchant}', [MerchantController::class, 'update']);

   Route::get('/merchant-product/{merchant}/{product}', [MerchantProductController::class, 'index']);
   Route::post('/merchant-product/{merchant}', [MerchantProductController::class, 'store']);
   Route::put('/merchant-product/{merchant}/{product}', [MerchantProductController::class, 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/merchant-profile', [MerchantController::class, 'getMyMerchantProfile'])->middleware('role:keeper');
});
