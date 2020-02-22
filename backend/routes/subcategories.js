const express = require("express");
const {
  getAllSubcats,
  createSubcat,
  getSingleSubcat,
  updateSubcat,
  deleteSubcat
} = require("../controllers/subcategories");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllSubcats)
  .post(createSubcat);

router
  .route("/:subcatId")
  .get(getSingleSubcat)
  .put(updateSubcat)
  .delete(deleteSubcat);

module.exports = router;
