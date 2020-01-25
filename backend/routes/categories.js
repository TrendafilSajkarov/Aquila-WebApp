const express = require("express");
const {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categories");

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(createCategory);

router
  .route("/:id")
  .get(getSingleCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
