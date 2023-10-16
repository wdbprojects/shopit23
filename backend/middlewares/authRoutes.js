import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

/* CHECKS IF USER IS AUTHENTICATED OR NOT */
const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  /* IF TOKEN IS THERE VERIFY IF IT IS EXPIRED */
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

/* AUTHORIZED ROLES */
const authorizedRoles = (...roles) => {
  const response = (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
  return response;
};

export { isAuthenticatedUser, authorizedRoles };
