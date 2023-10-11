import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectDB = async (url) => {
  try {
    const conn = await mongoose.connect(url);
    if (conn) {
      console.log(`Successfully connected to database ${conn.connection.name}`);
    }
  } catch (err) {
    console.log(`Database error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
