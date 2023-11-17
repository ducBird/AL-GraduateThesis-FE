import { ICustomerCart } from "./ICustomerCart";

export interface ICustomer {
  _id?: object;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  phone_number?: string;
  address?: string;
  email?: string;
  password?: string;
  birth_day?: Date;
  account_type?: string;
  active?: boolean;
  is_delete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  points: number;
  customer_cart: ICustomerCart[];
}
