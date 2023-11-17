export interface IProductReviews {
  _id: object;
  customer_id: string;
  product_id: string;
  order_id: string;
  rating: number;
  comment: string;
  reviewCount: number;
  date: string;
}
