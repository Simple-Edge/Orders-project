import { FavoriteProductsInterface } from '../models/product.favorite-products.model';
import { UserToOrdersInterface } from '../models/order.user-to-orders.model';
import { UserType } from '../types/user.type';

export interface UserResponseInterface {
  favoriteProducts: FavoriteProductsInterface,
  orders: UserToOrdersInterface[],
  user: UserType;
  token: string;
}
