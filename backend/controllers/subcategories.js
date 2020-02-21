const ErrorResponse = require("../utils/errorResponse");
const Language = require("../models/Language");
const Category = require("../models/Category");
const Post = require("../models/Post");

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
    let query;
    query = Category.find({
      category: req.params.categoryId
    });
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
    const subcategory = await query;

    res.status(200).json({
      success: true,
      count: subcategory.length,
      data: subcategory
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create Subcategory
// @route     POST  /api/v1/languages/:languageId/categories/:categoryId/subcat
// @access    Private
exports.createSubcat = async (req, res, next) => {
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
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(
        new ErrorResponse(
          `Language not found with id of ${req.params.categoryId}`,
          404
        )
      );
    }
    const subcategory = await Category.create({
      ...req.body,
      language: req.params.languageId,
      category: req.params.categoryId
    });

    res.status(201).json({ success: true, data: subcategory });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single subcategory
// @route     POST  /api/v1/languages/:languageId/categories/:categoryId/subcat/:subcatId
// @access    Public
exports.getSingleSubcat = async (req, res, next) => {
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
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(
        new ErrorResponse(
          `Language not found with id of ${req.params.categoryId}`,
          404
        )
      );
    }
    let query;
    query = Category.findById(req.params.subcatId).populate(
      "subcategories posts"
    );
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
    const subcategory = await query;

    res.status(200).json({
      success: true,
      data: subcategory
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update subcategory
// @route     PUT  /api/v1/languages/:languageId/categories/:categoryId/subcat/:subcatId
// @access    Private
exports.updateSubcat = async (req, res, next) => {
  try {
    const subcategory = await Category.findByIdAndUpdate(
      req.params.subcatId,
      { ...req.body, slug: slugify(req.body.name, { lower: true }) },
      {
        new: true,
        runValidators: true
      }
    );
    if (!subcategory) {
      return next(
        new ErrorResponse(
          `Category not found with id of ${req.params.subcatId}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: subcategory });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete subcategory
// @route     PUT  /api/v1/languages/:languageId/categories/:categoryId/subcat/:subcatId
// @access    Private
exports.deleteSubcat = async (req, res, next) => {
  try {
    const subcategory = await Category.findById(req.params.subcatId);
    if (!subcategory) {
      return next(
        new ErrorResponse(
          `Category not found with id of ${req.params.subcatId}`,
          404
        )
      );
    }
    await subcategory.remove();
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
