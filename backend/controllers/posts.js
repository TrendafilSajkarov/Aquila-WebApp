const ErrorResponse = require("../utils/errorResponse");
const Language = require("../models/Language");
const Category = require("../models/Category");
const Post = require("../models/Post");

const slugify = require("slugify");

// @desc      Get all Posts from Category
// @route     GET  /api/v1/languages/:languageId/categories/:categoryId/posts
// @access    Public
exports.getAllPosts = async (req, res, next) => {
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
    // check if category exsists
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(
        new ErrorResponse(
          `Category not found with id of ${req.params.categoryId}`,
          404
        )
      );
    }
    // Pagination
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 2;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let total = await Post.countDocuments({ category: req.params.categoryId });
    let query;
    query = Post.find({
      category: req.params.categoryId,
      language: req.params.languageId
    });
    query = query.skip(startIndex).limit(limit);
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

    const posts = await query;

    // Pagination result
    const pagination = { total };
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get Single Post from Category
// @route     GET  /api/v1/languages/:languageId/categories/:categoryId/posts/:postId
// @access    Public
exports.getSinglePost = async (req, res, next) => {
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
    // check if category exsists
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(
        new ErrorResponse(
          `Category not found with id of ${req.params.categoryId}`,
          404
        )
      );
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404)
      );
    }
    let query;
    query = Post.findById({ _id: req.params.postId });
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    post = await query;
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create Post
// @route     POST  /api/v1/languages/:languageId/categories/:categoryId/posts
// @access    Private
exports.createPost = async (req, res, next) => {
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
    // check if category exsists
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(
        new ErrorResponse(
          `Category not found with id of ${req.params.categoryId}`,
          404
        )
      );
    }
    const post = await Post.create({
      ...req.body,
      language: req.params.languageId,
      category: req.params.categoryId
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc      Update Category
// @route     PUT  /api/v1/languages/:languageId/categories/:categoryId/posts/:postId
// @access    Private
exports.updatePost = async (req, res, next) => {
  try {
    let body;
    if (req.body.title) {
      body = { ...req.body, slug: slugify(req.body.title, { lower: true }) };
    } else {
      body = { ...req.body };
    }
    const post = await Post.findByIdAndUpdate(req.params.postId, body, {
      new: true,
      runValidators: true
    });
    if (!post) {
      return next(
        new ErrorResponse(
          `Category not found with id of ${req.params.postId}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete Post
// @route     DELETE  /api/v1/languages/:languageId/categories/:categoryId/posts/:postId
// @access    Protected
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404)
      );
    }
    await post.remove();
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
