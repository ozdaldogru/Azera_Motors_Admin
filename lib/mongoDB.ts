
import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  if (isConnected) {
    // Prevent multiple connections in dev/hot-reload/serverless
    return;
  }

  if (mongoose.connections[0].readyState) {
    isConnected = true;
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI!, {
    dbName: "Azera_Motor_admin",
  });

  isConnected = true;
};

