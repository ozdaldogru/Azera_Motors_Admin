import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({

  make: String,
  model: String,
  price: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
  numberofowner: Number,
  year: Number,
  mileage: Number,
  driveType: String,
  fuelType: String,
  transmission: String,
  engineSize: Number,
  cylinder: Number,
  color: String,
  interiorColor: String,
  door: Number,
  status: String,  
  description: String,
  vin: String,
  history: String,
  media: [String],
  categories: String, 
  totalCost: Number,
  soldPrice: Number,
  soldDate: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;


