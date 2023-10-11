import express from "express";
const app = express();
import dotenv from "dotenv";
import productRouter from "./routes/productRoutes.js";
import connectDB from "./config/connectDB.js";
import errorMiddleware from "./middlewares/errors.js";
import process from "process";

/* HANDLE UNCAUGHT EXECEPTIONS */
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to Uncaught Exception");
  process.exit(1);
});

dotenv.config({ path: "./config/config.env" });
app.use(express.json());

/* ROUTES */
app.use("/api/v1", productRouter);

/* ERROR MIDDLEWARE */
app.use(errorMiddleware);

const serverConnect = async () => {
  try {
    await connectDB(process.env.CONNECTION_STRING);
    const server = app.listen(process.env.PORT, () => {
      console.log(
        `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
      );
      /* HANDLE UNHANDLED PROMISE REJECTION */
      process.on("unhandledRejection", (err) => {
        console.log(`ERROR: ${err}`);
        console.log("Shutting down server due to Unhandled Promise Rejection");
        server.close(() => {
          process.exit(1);
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

serverConnect();
