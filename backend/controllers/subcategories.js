const ErrorResponse = require("../utils/errorResponse");
const Language = require("../models/Language");
const Category = require("../models/Category");

const slugify = require("slugify");

// @desc      Get all Subcategories from specific Category
// @route     GET  /api/v1/languages/:languageId/categories/:categoryId/subcat
// @access    Public
exports.getAllSubcats = async (req, res, next) => {
  try {
    const language = await Language.findById(req.params.languageId);
    if (!language) {
      return next(
        new ErrorResponse(
          `Not found Language with ID of ${req.params.languageId}`,
          404
        )
      );
    }
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(
        new ErrorResponse(
          `Not found Category with ID of ${req.params.categoryId}`,
          404
        )
      );
    }
    const subcategory = await Category.find({
      category: req.params.categoryId
    });
    res.status(200).json({
      success: true,
      count: subcategory.length,
      data: subcategory
    });
  } catch (err) {
    next(err);
  }
};
