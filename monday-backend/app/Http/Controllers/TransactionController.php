<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Services\TransactionService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    //
    private TransactionService $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function index()
    {
        $fields = ["*"];
        $transactions = $this->transactionService->getAll($fields);

        return response()->json(TransactionResource::collection($transactions));
    }

    public function show(int $transactionId)
    {
        try {
            $transaction = $this->transactionService->getById($transactionId);

            return response()->json(new TransactionResource($transaction));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'transaction not found'
            ], 404);
        }
    }

    public function create(TransactionRequest $request)
    {
        $transaction = $this->transactionService->create($request->validated());

        return response()->json(new TransactionResource($transaction));
    }

    public function showByMerchant(int $merchantId)
    {
        try {
            $transactions = $this->transactionService->getByMerchantId($merchantId, ['*']);

            return response()->json(TransactionResource::collection($transactions));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'trasaction not found'
            ], 404);
        }
    }
}
