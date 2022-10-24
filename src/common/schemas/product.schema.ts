import mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },

  description: { type: String, default: '' },

  price: { type: Number, required: true },

  priceWithDiscount: { type: Number, required: false },

  count: { type: Number, required: true },

  discount: { type: Number, default: 0 },

  favoriteCount: {type: Number, default: 0},

  created: {type: Date, default: Date.now()},
  
  updated: Date,

  deleted: Date,
});

ProductSchema.index({ name: 'text'})

// function applyDiscount() {
//     this.priceWithDiscount =  +(this.price * ((100 - this.discount)/100)).toFixed(2)
// }
