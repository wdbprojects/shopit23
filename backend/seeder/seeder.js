import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import productsData from "./data.js";
dotenv.config({ path: "./config/config.env" });
mongoose.set("strictQuery", false);

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    await Product.deleteMany();
    console.log("many products deleted!");
    await Product.insertMany(productsData);
    console.log("many products added to the database!");
    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};

seedProducts();
