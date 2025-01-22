import mongoose from "mongoose";

const driveTypeSchema = new mongoose.Schema({
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

const DriveType =mongoose.models.DriveType || mongoose.model("DriveType", driveTypeSchema);

export default DriveType;