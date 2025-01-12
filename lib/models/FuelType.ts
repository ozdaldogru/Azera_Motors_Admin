import mongoose from "mongoose";

const fuelTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
})

const FuelType =mongoose.models.FuelType || mongoose.model("FuelType", fuelTypeSchema);

export default FuelType;