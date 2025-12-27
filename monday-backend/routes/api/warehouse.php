<?php

use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('role:manager')->group(function() {
        Route::get('/warehouse', [WarehouseController::class, 'index']);
        Route::post('/warehouse', [WarehouseController::class, 'store']);
        Route::get('/warehouse/{warehouse}', [WarehouseController::class, 'show']);
        Route::put('/warehouse/{warehouse}', [WarehouseController::class, 'update']);
        Route::delete('/warehouse/{warehouse}', [WarehouseController::class, 'destroy']);
        Route::post('/warehouse-product/{warehouse}', [WarehouseController::class, 'assignProduct']);
        Route::get('/warehouse-product/{warehouse}/{product}', [WarehouseController::class, 'getWarehouseProduct']);
    });
});
