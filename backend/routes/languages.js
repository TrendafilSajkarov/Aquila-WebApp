const express = require("express");
const {
  getAllLanguages,
  getSingleLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getAllCategories
} = require("../controllers/languages");

const router = express.Router();

router
  .route("/")
  .get(getAllLanguages)
  .post(createLanguage);

router
  .route("/:id")
  .get(getSingleLanguage)
  .put(updateLanguage)
  .delete(deleteLanguage);
module.exports = router;
