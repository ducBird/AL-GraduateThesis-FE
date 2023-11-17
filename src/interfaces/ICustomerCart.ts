import { IAttributes } from "./IAttributes";
import { IProduct } from "./IProducts";

export interface ICustomerCart {
  product_id: string;
  quantity: number;
  product: IProduct[];
  attributes: IAttributes[];
  variants_id: string;
}
