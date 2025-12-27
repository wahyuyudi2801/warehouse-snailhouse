<?php

namespace App\Services;

use App\Repositories\MerchantProductRepository;
use App\Repositories\TransactionRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionService
{
    private TransactionRepository $transactionRepository;
    private MerchantService $merchantService;
    private MerchantProductRepository $merchantProductRepository;

    public function __construct(
        TransactionRepository $transactionRepository,
        MerchantService $merchantService,
        MerchantProductRepository $merchantProductRepository,
    ) {
        $this->transactionRepository = $transactionRepository;
        $this->merchantService = $merchantService;
        $this->merchantProductRepository = $merchantProductRepository;
    }

    public function getAll(array $fields)
    {
        return $this->transactionRepository->getAll($fields);
    }

    public function getById(int $transactionId, array $fields = ['*'])
    {
        return $this->transactionRepository->getById($transactionId, $fields);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $name = $data['name'];
            $phone = $data['phone'];
            $subTotal = $data['sub_total'];
            $taxTotal = $data['tax_total'];
            $grandTotal = $data['grand_total'];
            $merchantId = $data['merchant_id'];

            $transaction = $this->transactionRepository->create([
                'name' => $name,
                'phone' => $phone,
                'sub_total' => $subTotal,
                'tax_total' => $taxTotal,
                'grand_total' => $grandTotal,
                'merchant_id' => $merchantId,
            ]);

            foreach ($data['transaction_products'] as $transProduct) {
                $productId = $transProduct['product_id'];
                $quantity = $transProduct['quantity'];
                $price = $transProduct['price'];
                $subTotalProduct = $transProduct['sub_total'];

                $existing = $this->merchantProductRepository->getByMerchantAndProduct($merchantId, $productId);

                if (!$existing) {
                    throw ValidationException::withMessages([
                        'message' => ['product not assigned to this merchant']
                    ]);
                }

                $currentStock = $existing->stock;
                $newStock = $currentStock - $transProduct['quantity'];

                if ($currentStock <= 0) {
                    throw ValidationException::withMessages([
                        'message' => ['out of stock']
                    ]);
                }

                if ($newStock > $currentStock) {
                    throw ValidationException::withMessages([
                        'message' => ['stock value exceeds available stock.']
                    ]);
                }

                $this->merchantProductRepository->updateStock($merchantId, $productId, $newStock);

                $transaction->transactionProducts()->create([
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'price' => $price,
                    'sub_total' => $subTotalProduct,
                ]);

            }

            return $transaction;
        });
    }

    public function getByMerchantId(int $merchantId, array $fields)
    {
        return $this->transactionRepository->getByMerchantId($merchantId, $fields);
    }
}
