const ErrorResponse = require("../utils/errorResponse");
const Category = require("../models/Category");

// @desc      Get all Categories
// @route     GET  /api/v1/categories
// @access    Public
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find(req.query);
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single Category
// @route     GET  /api/v1/categories/:id
// @access    Public
exports.getSingleCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc      Post new Category
// @route     POST  /api/v1/categories
// @access    Protected
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc      Update Category
// @route     PUT  /api/v1/categories/:id
// @access    Protected
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete Category
// @route     DELETE  /api/v1/categories/:id
// @access    Protected
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
