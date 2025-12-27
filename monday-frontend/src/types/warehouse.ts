import type { ProductType } from "./product";

export type WarehouseType = {
    id: number;
    name: string;
    address: string;
    photo: string;
    phone: string;
    products: ProductType[],
}