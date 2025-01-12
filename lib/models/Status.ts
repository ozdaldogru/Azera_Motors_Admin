import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
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

const Status =mongoose.models.Status || mongoose.model("Status", statusSchema);

export default Status;