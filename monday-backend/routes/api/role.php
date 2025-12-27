<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:manager'])->group(function () {
    Route::get('/role', [RoleController::class, 'index']);
    Route::post('/assign-role', [RoleController::class, 'assignRole']);
});
