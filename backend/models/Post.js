const mongoose = require("mongoose");
const slugify = require("slugify");

const PostSchema = new mongoose.Schema({
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  title: {
    type: String,
    required: [true, "Please Enter a Title for your Post"]
  },
  content: String,
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Post slug from title
PostSchema.pre("save", function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Post", PostSchema);
