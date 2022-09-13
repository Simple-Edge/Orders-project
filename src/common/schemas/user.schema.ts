import mongoose from 'mongoose';
import { OrderSchema } from './order.schema';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  lastName: { type: String, required: true },

  email: { type: String, required: true },

  password: { type: String, required: true },

  created: {type: Date, default: Date.now()},
  
  updated: Date,

  deleted: Date,

  lastActivity: {type: Date, default: Date.now()},
});

// role: RoleSchema,

// UserSchema.index({ email: 1 }, { unique: true });
