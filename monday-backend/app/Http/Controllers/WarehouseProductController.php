<?php

namespace App\Http\Controllers;

use App\Http\Requests\WarehouseProductRequest;
use App\Http\Requests\WarehouseProductUpdateRequest;
use App\Services\WarehouseService;
use Illuminate\Http\Request;

class WarehouseProductController extends Controller
{
    //
    private $warehouseService;

    public function __construct(WarehouseService $warehouseService)
    {
        $this->warehouseService = $warehouseService;
    }

    public function attach(WarehouseProductRequest $request, int $warehouseId)
    {
        $this->warehouseService->attachProduct(
            $warehouseId,
            $request->validated()['product_id'],
            $request->validated()['stock']
        );

        return response()->json([
            'message' => 'Product attached successfully'
        ]);
    }

    public function detach(int $warehouseId, int $productId)
    {
        $this->warehouseService->detachProduct($warehouseId, $productId);

        return response()->json([
            'message' => 'Product detached successfully'
        ]);
    }

    public function update(WarehouseProductUpdateRequest $request, int $warehouseId, int $productId)
    {
        $warehouseProduct = $this->warehouseService->updateProductStock(
            $warehouseId,
            $productId,
            $request->validated()['stock']
        );

        return response()->json([
            'message' => 'Stock updated successfully',
            'data' => $warehouseProduct
        ]);
    }
}
