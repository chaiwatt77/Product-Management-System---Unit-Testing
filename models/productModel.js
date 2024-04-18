import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number
});

const products = mongoose.model("products", ProductSchema);
export default products;
