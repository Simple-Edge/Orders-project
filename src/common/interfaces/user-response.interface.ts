import { FavoriteProductsInterface } from '../models/product.favorite-products.model';
import { UserToOrdersInterface } from '../models/order.userToOrders.model';
import { UserType } from '../types/user.type';

export interface UserResponseInterface {
  favoriteProducts: FavoriteProductsInterface,
  orders: UserToOrdersInterface[],
  user: UserType;
  token: string;
}
