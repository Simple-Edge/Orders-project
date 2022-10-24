import mongoose, { Schema } from 'mongoose';

export const FavoriteProductsSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],

    created: { type: Date, default: Date.now() },

    updated: Date,

    deleted: Date,
});