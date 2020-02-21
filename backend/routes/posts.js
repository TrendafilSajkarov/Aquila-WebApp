const express = require("express");
const {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/posts");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllPosts)
  .post(createPost);
router
  .route("/:postId")
  .get(getSinglePost)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;
