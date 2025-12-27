<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/category', [CategoryController::class, 'index'])->middleware('permission:view category');
    Route::get('/category/{category}', [CategoryController::class, 'show'])->middleware('permission:view category');
    Route::group(['middleware' => ['permission:manage category']], function () {
        Route::post('/category', [CategoryController::class, 'store']);
        Route::put('/category/{category}', [CategoryController::class, 'update']);
        Route::delete('/category/{category}', [CategoryController::class, 'destroy']);
    });
});
