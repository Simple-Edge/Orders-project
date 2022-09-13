import mongoose, { Schema } from 'mongoose';
import { UserSchema } from './user.schema';

export const OrderSchema = new mongoose.Schema({
    customerInfo: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    description: { type: String, default: '' },

    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            count: { type: Number, required: true },
        }
    ],

    totalPrice: { type: Number, required: true },

    readyToTake: Date,

    created: { type: Date, default: Date.now() },

    updated: Date,

    deleted: Date,
});