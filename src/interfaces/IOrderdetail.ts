import { IProduct } from "./IProducts";
import { IVariants } from "./IVariants";

export interface IOrderDetail {
  product_id: string;
  quantity: number;
  product: IProduct[];
  variants: IVariants[];
}
