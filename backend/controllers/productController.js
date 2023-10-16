import mongoose from "mongoose";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import APIFilters from "../utils/apiFilters.js";

/* LIST ALL PRODUCTS => /api/v1/products */
const getProducts = catchAsyncErrors(async (req, res) => {
  const resPerPage = 3;
  /* SEARCH & FILTERS */
  const apiFilters = new APIFilters(Product, req.query).search().filters();
  let products = await apiFilters.query;
  let filteredProductsCount = products.length;
  /* PAGINATION */
  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();
  /* RESPONSE */
  res.status(200).json({ resPerPage, filteredProductsCount, products });
});

/* CREATE NEW PRODUCT => /api/v1/admin/products */
const newProduct = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user._id;

  const product = await Product.create(req.body);
  res
    .status(200)
    .json({ msg: "Product created successfully", product: product });
});

/* GET PRODUCT BY ID => /api/v1/products/:id */
const getProductById = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorHandler("Custom Error Handler: Product not found!", 404),
    );
  } else {
    res.status(200).json({ product });
  }
});

/* UPDATE PRODUCT => /api/v1/admin/products/:id */
const updateProduct = catchAsyncErrors(async (req, res) => {
  let id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    returnDocument: "after",
    new: true,
  });
  if (!product) {
    return next(
      new ErrorHandler("Custom Error Handler: Product not found!", 404),
    );
  } else {
    res
      .status(200)
      .json({ msg: "Product updated successfully", product: product });
  }
});

/* DELETE PRODUCT => /api/v1/admin/products/:id */
const deleteProduct = catchAsyncErrors(async (req, res) => {
  const productToDelete = await Product.findById(req.params.id);
  if (!productToDelete) {
    return next(
      new ErrorHandler("Custom Error Handler: Product not found!", 404),
    );
  } else {
    await productToDelete.deleteOne();
    res.status(200).json({
      msg: "Product deleted successfully",
      deletedProduct: productToDelete,
    });
  }
});

export {
  getProducts,
  newProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
