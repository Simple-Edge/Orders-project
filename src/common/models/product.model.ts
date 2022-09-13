import { Document } from 'mongoose';

export interface ProductInterface extends Document {
  name: string;
  description?: string;
  price: number;
  priceWithDiscount?: number;
  count: number;
  discount?: number;
  created: Date;
  updated?: Date;
  deleted?: Date;
}
