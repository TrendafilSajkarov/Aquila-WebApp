const ErrorResponse = require("../utils/errorResponse");
const Language = require("../models/Language");
const Category = require("../models/Category");

const slugify = require("slugify");

// @desc      Get all Categories from Language
// @route     GET  /api/v1/languages/:languageId/categories
// @access    Public
exports.getAllCategories = async (req, res, next) => {
  try {
    // check if language exsists
    const language = await Language.findById(req.params.languageId);
    if (!language) {
      return next(
        new ErrorResponse(
          `Language not found with id of ${req.params.languageId}`,
          404
        )
      );
    }
    let query;
    query = Category.find({
      category: undefined,
      language: req.params.languageId
    }).populate("subcategories");
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const categories = await query;
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
// @route     GET  /api/v1/languages/:languageId/categories/:categoryId
// @access    Public
exports.getSingleCategory = async (req, res, next) => {
  try {
    // check if language exsists
    const language = await Language.findById(req.params.languageId);
    if (!language) {
      return next(
        new ErrorResponse(
          `Language not found with id of ${req.params.languageId}`,
          404
        )
      );
    }
    let query;
    query = Category.findById({ _id: req.params.categoryId }).populate({
      path: "language subcategories",
      select: "name nameInEnglish"
    });
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    const categories = await query;

    if (!categories) {
      return next(
        new ErrorResponse(
          `Category not found with id of ${req.params.categoryId}`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Post new Category in a Language
// @route     POST  /api/v1/languages/:languageId/categories
// @access    Protected
exports.createCategory = async (req, res, next) => {
  try {
    const language = await Language.findById(req.params.languageId);
    if (!language) {
      return next(
        new ErrorResponse(
          `Language not found with id of ${req.params.languageId}`,
          404
        )
      );
    }
    const category = await Category.create({
      ...req.body,
      language: req.params.languageId
    });

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
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, slug: slugify(req.body.name, { lower: true }) },
      {
        new: true,
        runValidators: true
      }
    );
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
// @route     DELETE  /api/v1/languages/:languageId/categories/:categoryId
// @access    Protected
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(
        new ErrorResponse(
          `Category not found with id of ${req.params.categoryId}`,
          404
        )
      );
    }
    await category.remove();
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
