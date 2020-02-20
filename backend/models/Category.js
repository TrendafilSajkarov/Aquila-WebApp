const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    language: { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: undefined
    },
    name: {
      type: String,
      maxlength: [30, "Name of Category can not be more than 30 characters"]
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create Category slug from name
CategorySchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

CategorySchema.pre("remove", async function(next) {
  let subcategories = await this.model("Category").find({ category: this._id });
  if (subcategories) {
    subcategories.forEach(async subcategory => {
      await subcategory.remove();
    });
  }
  next();
});

// Reverse populate with virtuals
// (you have to use it with populate("subcategories") in the controller in order to show up)
CategorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "category",
  justOne: false
});

module.exports = mongoose.model("Category", CategorySchema);
