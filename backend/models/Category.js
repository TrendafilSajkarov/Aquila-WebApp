const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
    unique: true,
    maxlength: [30, "Name of Category can not be more than 30 characters"]
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Category slug from name
CategorySchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
