import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
})

const Feature =mongoose.models.Feature || mongoose.model("Feature", featureSchema);

export default Feature;