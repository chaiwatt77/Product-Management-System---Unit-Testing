import mongoose from 'mongoose';

const connectionString = "mongodb://127.0.0.1:27017/btdDb";

export const connectDb = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Connect to DB error:", error);
  }
};

export const db = mongoose.connection;
