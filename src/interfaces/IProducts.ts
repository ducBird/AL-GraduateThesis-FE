import { ICategory } from "./ICategory";
import { IVariants } from "./IVariants";

export interface IProduct {
  _id: string | undefined;
  category_id: string;
  sub_category_id: string;
  name: string;
  price: number;
  total: number;
  product_image: string;
  discount: number;
  sort_order: number;
  category: ICategory;
  variants: IVariants[];
}
