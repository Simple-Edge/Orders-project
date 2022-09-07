import mongoose from 'mongoose';
import { ProductSchema } from './product.schema';
import { UserSchema } from './user.schema';

export const OrderSchema = new mongoose.Schema({
    createdAt: {type: Date, default: Date.now()},
    
    customerInfo: {type: UserSchema,required: true},

    orderInfo: [{type: ProductSchema,required: true}],
   
    totalPrice: {type: Number,required: true},
   
    readyToTake: {type: Boolean, default: false},
});