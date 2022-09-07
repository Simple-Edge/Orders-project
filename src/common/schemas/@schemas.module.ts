import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { OrderSchema } from './order.schema';
import { ProductSchema } from './product.schema';
import { UserSchema } from './user.schema';

const SCHEMAS: Array<{ name: string; schema: Schema }> = [
  { name: 'Product', schema: ProductSchema },
  { name: 'User', schema: UserSchema },
  { name: 'Order', schema: OrderSchema },
  
];

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  exports: [MongooseModule.forFeature(SCHEMAS)],
})
export class SchemasModule {}
