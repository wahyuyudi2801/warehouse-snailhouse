import { sanctumRequest } from "@/services/sanctumRequest"
import type { CreateTransactionType } from "@/types/transaction"

export const newTransaction = async (transactions: CreateTransactionType) => {
    
    const formData = new FormData()
    formData.append('name', transactions.name)
    formData.append('phone', transactions.phone)
    formData.append('qty_total', transactions.qty_total.toString())
    formData.append('sub_total', transactions.sub_total.toString())
    formData.append('tax_total', transactions.tax_total.toString())
    formData.append('grand_total', transactions.grand_total.toString())
    formData.append('merchant_id', transactions.merchant_id.toString())
    formData.append('transaction_products', JSON.stringify(transactions.transaction_products))

    const response = await sanctumRequest('POST', '/transaction', transactions)

    return response.data
}

export const getAllTransaction = async () => {
    const response = await sanctumRequest('GET', '/transaction')

    return response.data
}

export const getTransactionByMerchant = async (merchantID: number) => {
    const response = await sanctumRequest('GET', `/transaction/${merchantID}`)
    return response.data
}