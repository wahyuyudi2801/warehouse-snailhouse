import type { ProductType } from "./product";

export type CategoryType = {
  id: number;
  name: string;
  tagline: string;
  photo: string;
  products: ProductType[];
};
