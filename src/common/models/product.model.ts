import { Document } from "mongoose";

export interface ProductInterface extends Document {
  productName: string;
  description: string;
  price: number;
  priceWithDiscount?: number;
  productCount: number;
  discount: number;
}
