import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
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

const Condition =mongoose.models.Condition || mongoose.model("Condition", conditionSchema);

export default Condition;