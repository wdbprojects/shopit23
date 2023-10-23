/* UPDATE ORDER DETAIL - [ADMIN] => /api/v1/admin/orders/:id */
const updateOrderById = catchAsyncErrors(async (req, res, next) => {
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
  const updatedOrder = {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  };
  const order = await Order.findByIdAndUpdate(req.params.id, updatedOrder, {
    new: true,
  });
  if (!order) return next(new ErrorHandler("No order to update found", 404));
  if (order?.orderStatus === "Delivered")
    return next(new ErrorHandler("You have already delivered this order", 404));

  res.status(200).json({
    success: true,
    order: order,
  });
});
