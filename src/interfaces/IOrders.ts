import { IOrderDetail } from "./IOrderdetail";

export interface IOrders {
  _id?: object;
  status?: string;
  shipping_information?: string;
  email?: string;
  order_details?: IOrderDetail[] | undefined;
}
