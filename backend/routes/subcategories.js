const express = require("express");
const { getAllSubcats } = require("../controllers/subcategories");

const router = express.Router({ mergeParams: true });

router.route("/").get(getAllSubcats);

module.exports = router;
