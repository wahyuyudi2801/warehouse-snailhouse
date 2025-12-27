<?php

use Illuminate\Support\Facades\Route;

Route::get('/server-test', function () {
    return response()->json([
        'message' => 'server is running...'
    ]);
});

require __DIR__ . '/api/auth.php';
require __DIR__ . '/api/user.php';
require __DIR__ . '/api/role.php';
require __DIR__ . '/api/category.php';
require __DIR__ . '/api/product.php';
require __DIR__ . '/api/warehouse.php';
require __DIR__ . '/api/merchant.php';
require __DIR__ . '/api/transaction.php';
