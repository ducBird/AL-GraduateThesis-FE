import { IAttributes } from "./IAttributes";
import { ICategory } from "./ICategory";
import { IProductReviews } from "./IProductReviews";
import { IVariants } from "./IVariants";

export interface IProduct {
  _id?: string | undefined;
  category_id: string;
  sub_category_id: string;
  name: string;
  price: number;
  stock: number;
  total: number;
  product_image: string;
  discount: number | undefined;
  sort_order: number;
  category: ICategory;
  variants: IVariants[];
  attributes: IAttributes[];
  reviews?: IProductReviews[] | undefined;
}
