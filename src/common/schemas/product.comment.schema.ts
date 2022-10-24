import mongoose, { Schema } from 'mongoose';

export const CommentSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    message: { type: String, required: true},
    
    product: { type: Schema.Types.ObjectId, ref: 'Product'},

    usersLikes: [{ type: Schema.Types.ObjectId, ref: 'User'}],

    usersDislikes: [{ type: Schema.Types.ObjectId, ref: 'User'}],

    commentThread: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],

    created: { type: Date, default: Date.now() },

    updated: Date,

    deleted: Date,
});