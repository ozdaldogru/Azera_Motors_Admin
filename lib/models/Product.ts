import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
  title: String,
  make: String,
  price: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
  condition: String,
  numberofowner: Number,
  year: Number,
  mileage: Number,
  lowmileage: [String],
  driveType: String,
  fuelType: String,
  consumption: Number,
  transmission: String,
  engineSize: Number,
  cylinder: Number,
  color: String,
  interiorColor: String,
  door: Number,
  status: String,  
  description: String,
  vin:  String,
  history: String,
  media: [String],
  categories: String, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;


