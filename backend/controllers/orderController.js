import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

/* CREATE NEW ORDER => /api/v1/orders/new */ // for cash only payment type
const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });
  res.status(200).json({ order: order });
});

/* GET ORDER DETAILS => /api/v1/orders/:id */
const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler("No order found with this ID", 404));
  res.status(200).json({
    success: true,
    order: order,
  });
});

/* GET CURRENT USER ORDERS => /api/v1/me/orders */
const getCurrentUserOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).populate("user", [
    "name",
    "email",
  ]);
  if (!orders)
    return next(new ErrorHandler("No orders found with this user ID", 404));
  res.status(200).json({
    success: true,
    numberOfOrders: orders.length,
    orders: orders,
  });
});

/* GET ALL ORDERS - [ADMIN] => /api/v1/admin/orders */
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders) return next(new ErrorHandler("No orders found", 404));
  res.status(200).json({
    success: true,
    numberOfOrders: orders.length,
    orders: orders,
  });
});

/* UPDATE ORDERS - [ADMIN] => /api/v1/admin/orders/:id */
const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler("No order to update found", 404));
  if (order?.orderStatus === "Delivered")
    return next(new ErrorHandler("You have already delivered this order", 400));
  // UPDATE PRODUCT STOCK
  order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item?.product?.toString());
    if (!product) return next(new ErrorHandler("No product found", 404));
    product.stock = product.stock - item?.quantity;
    await product.save({ validateBeforeSave: false });
  });
  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({
    success: true,
  });
});

/* DELETE ORDERS - [ADMIN] => /api/v1/admin/orders/:id */
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", [
    "name",
    "email",
  ]);
  if (!order) return next(new ErrorHandler("No order found with this ID", 404));
  await order.deleteOne();
  res.status(200).json({
    success: true,
    message: `Order ${order._id} deleted successfully`,
  });
});

export {
  newOrder,
  getOrderDetails,
  getCurrentUserOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
