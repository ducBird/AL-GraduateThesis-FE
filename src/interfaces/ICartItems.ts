import { IProduct } from "./IProducts";

export interface CartItems {
  product: IProduct | null;
  quantity: number;
}
