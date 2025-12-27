<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'sub_total' => 'required|integer|min:1',
            'tax_total' => 'required|integer|min:1',
            'grand_total' => 'required|integer|min:1',
            'merchant_id' => 'required|exists:merchants,id',
            'transaction_products' => 'required|array|min:1',
            'transaction_products.*.product_id' => 'required|exists:products,id',
            'transaction_products.*.quantity' => 'required|integer|min:1',
            'transaction_products.*.price' => 'required|integer|min:1',
            'transaction_products.*.sub_total' => 'required|integer|min:1',
        ];
    }
}
