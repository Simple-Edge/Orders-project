import { ProductInterface } from '../models/product.model';
import { CommentInterface } from '../models/product.comment.model';

export interface ProductResponseInterface {
  product: ProductInterface,
  comments: CommentInterface[],
}
