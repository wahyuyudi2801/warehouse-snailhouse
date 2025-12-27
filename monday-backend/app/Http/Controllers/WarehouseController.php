<?php

namespace App\Http\Controllers;

use App\Http\Requests\WarehouseProductRequest;
use App\Http\Requests\WarehouseRequest;
use App\Http\Resources\WarehouseResource;
use App\Services\WarehouseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    //
    private $warehouseService;

    public function __construct(WarehouseService $warehouseService)
    {
        $this->warehouseService = $warehouseService;
    }

    public function index()
    {
        $fields = ["id", "name", "photo", "phone", "address"];
        $warehouses = $this->warehouseService->getAll($fields);
        return response()->json(WarehouseResource::collection($warehouses));
    }

    public function show(int $warehouse)
    {
        try {
            $fields = ["id", "name", "photo", "phone", "address"];
            $result = $this->warehouseService->getById($warehouse, $fields);
            return response()->json(new WarehouseResource($result));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'warehouse not found'
            ], 404);
        }
    }

    public function store(WarehouseRequest $request)
    {
        $result = $this->warehouseService->create($request->validated());
        return response()->json(new WarehouseResource($result), 201);
    }

    public function update(WarehouseRequest $request, int $warehouse)
    {
        try {
            $result = $this->warehouseService->update($warehouse, $request->validated());
            return response()->json(new WarehouseResource($result));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'warehouse not found'
            ], 404);
        }
    }

    public function assignProduct(WarehouseProductRequest $request, int $warehouse)
    {
        try {
            $this->warehouseService->attachProduct(
                $warehouse,
                $request->validated()['product_id'],
                $request->validated()['stock'],
            );

            return response()->json([
                'message' => 'Assigning product successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'warehouse not found'
            ], 404);
        }
    }

    public function getWarehouseProduct($warehouse, $product)
    {
        try {
            $fields = ['*'];
            $warehouseProduct = $this->warehouseService->getByWarehouseIdAndProductId($warehouse, $product, $fields);

            return response()->json(new WarehouseResource($warehouseProduct));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'warehouse not found'
            ], 404);
        }
    }
}
