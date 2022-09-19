import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { FavoriteProductsSchema } from './product.favorite-products.schema';
import { OrderSchema } from './order.schema';
import { UserToOrdersSchema } from './order.userToOrders.schema';
import { ProductSchema } from './product.schema';
import { UserSchema } from './user.schema';
import { CommentSchema } from './product.comment.schema';

const SCHEMAS: Array<{ name: string; schema: Schema }> = [
  { name: 'Product', schema: ProductSchema },
  { name: 'User', schema: UserSchema },
  { name: 'Order', schema: OrderSchema },
  { name: 'UserToOrder', schema: UserToOrdersSchema },
  { name: 'FavoriteProduct', schema: FavoriteProductsSchema },
  { name: 'Comment', schema: CommentSchema },
];

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  exports: [MongooseModule.forFeature(SCHEMAS)],
})
export class SchemasModule {}
