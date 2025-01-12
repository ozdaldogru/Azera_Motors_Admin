import mongoose from "mongoose";

const transmissionSchema = new mongoose.Schema({
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

const Transmission =mongoose.models.Transmission || mongoose.model("Transmission", transmissionSchema);

export default Transmission;