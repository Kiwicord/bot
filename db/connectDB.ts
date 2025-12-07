import mongoose from "mongoose";

const uri = process.env.MONODB_URI!;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: "Kiwicord",
    });
    console.log("MongoDB Connection established");
  } catch (e) {
    console.error("MongoDB Connection error", e);
  }
};

export default connectDB;
