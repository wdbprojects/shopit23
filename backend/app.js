import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import errorMiddleware from "./middlewares/errors.js";
import process from "process";

/* ROUTER */
import productRouter from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

/* HANDLE UNCAUGHT EXECEPTIONS */
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to Uncaught Exception");
  process.exit(1);
});

dotenv.config({ path: "./config/config.env" });
app.use(express.json());
/* COOKIE PARSER */
app.use(cookieParser());

/* ROUTES */
app.use("/api/v1", productRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", orderRouter);

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
