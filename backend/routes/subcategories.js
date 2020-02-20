const express = require("express");
const {
  getAllSubcats,
  createSubcat,
  getSingleSubcat
} = require("../controllers/subcategories");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllSubcats)
  .post(createSubcat);

router.route("/:subcatId").get(getSingleSubcat);

module.exports = router;
