import mongoose from 'mongoose';

export const PermissionSchema = new mongoose.Schema({
    fullAcces: {type:Boolean, default: false},
    productFullAcces: {type:Boolean, default: false},
    orderFullAcces: {type:Boolean, default: false},

    productWrite: {type:Boolean, default: false},
    productDelete: {type:Boolean, default: false},

    orderRead: {type:Boolean, default: false},
    orderWrite: {type:Boolean, default: false},
    orderDelete: {type:Boolean, default: false},

    commentFullAcces: {type:Boolean, default: false},
    

});

export const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true },

    description: { type: String, required: true },

    permissions: {type: PermissionSchema, default: () => ({})},

    created: { type: Date, default: Date.now() },

    updated: Date,

    deleted: Date,

});


