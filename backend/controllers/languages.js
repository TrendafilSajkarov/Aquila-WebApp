const ErrorResponse = require("../utils/errorResponse");
const Language = require("../models/Language");
const ISO6391 = require("iso-639-1");

const slugify = require("slugify");

// @desc      Get all Languages
// @route     GET  /api/v1/languages
// @access    Public
exports.getAllLanguages = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Array with fields to exclude from reqQuery
    const removeFields = ["select", "sort"];
    removeFields.forEach(param => delete reqQuery[param]);

    // Finding resourse - Initializing the query
    query = Language.find(reqQuery);

    // Adding select() to the query to select sertain fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Adding sort() to the query to sort resourses by...
    // Default sorting desending createdAt (newest is first)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Executing query
    const languages = await query;
    res.status(200).json({
      success: true,
      count: languages.length,
      data: languages
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get Single Language
// @route     GET  /api/v1/languages/:id
// @access    Public
exports.getSingleLanguage = async (req, res, next) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return next(
        new ErrorResponse(`Language not foung with ID of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: language
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create Language
// @route     POST  /api/v1/languages
// @access    Private
exports.createLanguage = async (req, res, next) => {
  try {
    const language = await Language.create(req.body);
    res.status(201).json({ success: true, data: language });
  } catch (err) {
    next(err);
  }
};

// @desc      Update Language
// @route     PUT  /api/v1/languages/:id
// @access    Private
exports.updateLanguage = async (req, res, next) => {
  try {
    const slug = slugify(req.body.nameInEnglish, { lower: true });
    const languageCode = ISO6391.getCode(req.body.nameInEnglish);
    const nativeName = ISO6391.getNativeName(languageCode);
    const language = await Language.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        slug,
        languageCode,
        nativeName
      },
      {
        new: true,
        runValidators: true
      }
    );
    if (!language) {
      return next(
        new ErrorResponse(`Language not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: language });
  } catch (err) {
    next(err);
  }
};

// @desc      delete Language
// @route     DELETE  /api/v1/languages/:id
// @access    Private
exports.deleteLanguage = async (req, res, next) => {
  try {
    const language = await Language.findByIdAndDelete(req.params.id);
    if (!language) {
      return next(
        new ErrorResponse(`Language not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true
    });
  } catch (err) {
    next(err);
  }
};
