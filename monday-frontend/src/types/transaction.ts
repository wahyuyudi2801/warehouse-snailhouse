import type { MerchantType } from "./merchant";
import type { ProductType } from "./product";

export type CreateTransactionDetailType = {
  product_id: number;
  name: string;
  photo: string;
  category: string;
  quantity: number;
  price: number;
  sub_total: number;
};

export type CreateTransactionType = {
  name: string;
  phone: string;
  qty_total: number;
  sub_total: number;
  tax_total: number;
  grand_total: number;
  merchant_id: number;
  transaction_products: CreateTransactionDetailType[];
};

export type TransactionDetailType = {
  id: number;
  product_id: number;
  product: ProductType;
  quantity: number;
  price: number;
  sub_total: number;
  transaction_id: number;
};

export type TransactionType = {
  id: number;
  name: string;
  phone: string;
  sub_total: number;
  tax_total: number;
  grand_total: number;
  merchant_id: number;
  merchant: MerchantType;
  transaction_products: TransactionDetailType[];
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
};