import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [50, "Your name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Password has to be at least 8 characters"],
      maxLength: [20, "Password has to be 30 characters max"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

/* PASSWORD ENCRYPTION */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

/* RETURN JWT TOKEN */
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

/* COMPARE USER PASSWORD */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/* GENERATE PASSWORD RESET TOKEN */
userSchema.methods.getResetPasswordToken = function () {
  // GENERATE TOKEN
  const resetToken = crypto.randomBytes(20).toString("hex");
  // HASH AND SET TO resetPasswordToken FIELD
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // SET TOKEN EXPIRE TIME
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
