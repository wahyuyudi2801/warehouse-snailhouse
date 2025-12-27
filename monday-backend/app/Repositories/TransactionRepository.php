<?php

namespace App\Repositories;

use App\Models\Transaction;

class TransactionRepository
{
    public function getAll(array $fields)
    {
        return Transaction::select($fields)
            ->with(['transactionProducts.product.category', 'merchant'])
            ->latest()
            ->paginate(5);
    }

    public function getById(int $transactionId, array $fields)
    {
        return Transaction::select($fields)
            ->with(['transactionProducts.product.category', 'merchant'])
            ->findOrFail($transactionId);
    }

    public function create(array $data)
    {
        return Transaction::create($data);
    }

    public function getByMerchantId(int $merchantId, array $fields)
    {
        return Transaction::select($fields)
            ->where('merchant_id', $merchantId)
            ->with(['transactionProducts.product.category', 'merchant'])
            ->latest()
            ->paginate(5);
    }
}
