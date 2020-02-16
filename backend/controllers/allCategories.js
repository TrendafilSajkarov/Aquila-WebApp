const Category = require("../models/Category");
const ErrorResponse = require("../utils/errorResponse");

exports.getAllCat = async (req, res, next) => {
  try {
    const allCategories = await Category.find();
    if (!allCategories) {
      return next(new ErrorResponse(`Not found`, 404));
    }
    res.status(200).json({
      success: true,
      count: allCategories.length,
      data: allCategories
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCat = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(
        new ErrorResponse(
          `No Category with id of ${req.params.categoryId}`,
          404
        )
      );
    }
    category.remove();
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (err) {
    next(err);
  }
};
