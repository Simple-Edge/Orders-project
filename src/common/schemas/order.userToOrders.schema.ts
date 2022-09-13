import mongoose, { Schema } from 'mongoose';

export const UserToOrdersSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },

    created: { type: Date, default: Date.now() },

    updated: Date,

    deleted: Date,
});