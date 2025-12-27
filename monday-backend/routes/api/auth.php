<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthenticatedSessionController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'logout']);
    Route::get('/check-auth', function() {
        // auth with role
        $user = User::select(['id', 'name', 'email'])->findOrFail(Auth::user()->id);
        return response()->json([
            'message' => 'Authenticated',
            'user' => $user,
            'role' => $user->getRoleNames()->first()
        ], 200);
    });
});
