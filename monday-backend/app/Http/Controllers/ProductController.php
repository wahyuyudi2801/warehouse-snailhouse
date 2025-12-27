<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    //
    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index()
    {
        $fields = ['id', 'name', 'thumbnail', 'about', 'price', 'category_id', 'is_popular'];
        $products = $this->productService->getAll($fields);

        return response()->json(ProductResource::collection($products));
    }

    public function show(int $product)
    {
        try {
            $fields = ['id', 'name', 'thumbnail', 'price', 'about', 'is_popular', 'category_id'];
            $result = $this->productService->getById($product, $fields);

            return response()->json(new ProductResource($result));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'product not found'
            ], 404);
        }
    }

    public function store(ProductRequest $request)
    {
        $product = $this->productService->create($request->validated());

        return response()->json(new ProductResource($product));
    }

    public function update(ProductRequest $request, int $productId)
    {
        try {
            $product = $this->productService->update($productId, $request->validated());

            return response()->json(new ProductResource($product));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'product not found'
            ], 404);
        }
    }

    public function destroy(int $productId)
    {
        try {
            $this->productService->delete($productId);

            return response()->json([
                'message' => 'product deleted is successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'product not found'
            ], 404);
        }
    }
}
