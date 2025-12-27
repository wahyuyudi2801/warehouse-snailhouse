<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:keeper'])->group(function () {
    Route::get('/transaction/{merchantId}', [TransactionController::class, 'showByMerchant']);
    Route::post('/transaction', [TransactionController::class, 'create']);
});
Route::middleware(['auth:sanctum', 'permission:view transaction'])->group(function() {
    Route::get('/transaction', [TransactionController::class, 'index']);
});
