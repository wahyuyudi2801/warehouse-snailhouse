import type { CategoryType } from "./category";
import type { MerchantType } from "./merchant";

export type ProductType = {
  id: number;
  name: string;
  thumbnail: string;
  about: string;
  price: number;
  category_id: number;
  is_popular: number;
  category: CategoryType;
  merchants: MerchantType[];
  pivot?: {
    warehouse_id: number;
    product_id: number;
    stock: number;
  };
};
