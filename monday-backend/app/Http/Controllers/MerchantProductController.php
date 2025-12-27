<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerchantProductRequest;
use App\Http\Requests\MerchantProductUpdateRequest;
use App\Http\Resources\MerchantProductResource;
use App\Models\Merchant;
use App\Models\MerchantProduct;
use App\Services\MerchantProductService;
use Illuminate\Http\Request;

class MerchantProductController extends Controller
{
    //
    private MerchantProductService $merchantProductService;

    public function __construct(MerchantProductService $merchantProductService)
    {
        $this->merchantProductService = $merchantProductService;
    }

    public function index(int $merchant, int $product)
    {
        $merchantProduct = $this->merchantProductService->getByMerchantProduct($merchant, $product);

        return response()->json(new MerchantProductResource($merchantProduct));
    }

    public function store(MerchantProductRequest $request, int $merchant)
    {
        $validated = $request->validated();
        $validated['merchant_id'] = $merchant;

        $merchantProduct = $this->merchantProductService->assignProductToMerchant($validated);

        return response()->json([
            'message' => 'Product assigned to merchant successfully',
            'data' => $merchantProduct
        ]);
    }

    public function update(MerchantProductUpdateRequest $request, int $merchant, int $product)
    {
        $validated = $request->validated();

        $merchantProduct = $this->merchantProductService->updateStock(
            $merchant,
            $product,
            $validated['stock'],
            $validated['warehouse_id']
        );

        return response()->json([
            'message' => 'stock updated successfully',
            'data' => $merchantProduct
        ]);
    }

    public function destroy(int $merchantId, int $productId)
    {
        $this->merchantProductService->removeProductFromMerchant($merchantId, $productId);

        return response()->json([
            'message' => 'product detached from merchant successfully'
        ]);
    }
}
