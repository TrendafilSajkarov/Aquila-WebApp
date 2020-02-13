const express = require("express");
const {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categories");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllCategories)
  .post(createCategory);

router
  .route("/:categoryId")
  .get(getSingleCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
