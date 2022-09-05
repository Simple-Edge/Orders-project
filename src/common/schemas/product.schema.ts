import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },

  description: { type: String, default: '' },

  price: { type: Number, required: true },

  priceWithDiscount: { type: Number, required: false },

  productCount: { type: String, required: true },

  discount: { type: Number, default: 0 },
});

// function applyDiscount() {
//     this.priceWithDiscount =  +(this.price * ((100 - this.discount)/100)).toFixed(2)
// }
