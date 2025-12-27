import type { ProductType } from "./product";
import type { UserType } from "./user";
import type { WarehouseType } from "./warehouse";

export type MerchantType = {
    id: number;
    name: string;
    address: string;
    photo: string;
    phone: string;
    keeper_id: number;
    keeper: UserType | null;
    products: ProductType[]
}

export type MerchantProductType = {
    id: number;
    merchant_id: number;
    product_id: number;
    stock: number;
    warehouse_id: number;
    merchant: MerchantType;
    product: ProductType;
    warehouse: WarehouseType;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}