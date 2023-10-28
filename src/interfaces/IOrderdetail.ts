import { IProduct } from "./IProducts";

export interface IOrderDetail {
  product_id: string;
  quantity: number;
  product: IProduct[];
}
