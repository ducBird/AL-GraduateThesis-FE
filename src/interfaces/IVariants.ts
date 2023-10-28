import { IVariantOptions } from "./IVariantOptions";

export interface IVariants {
  _id: string;
  price_adjustment: number;
  title: string;
  options: IVariantOptions[] | null;
}
