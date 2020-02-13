const mongoose = require("mongoose");
const slugify = require("slugify");
const ISO6391 = require("iso-639-1");

const LanguageSchema = new mongoose.Schema({
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  nameInEnglish: {
    type: String,
    required: [true, "Please add the name of the Language in English"],
    unique: true
  },
  languageCode: {
    type: String,
    required: [
      true,
      "Language Code not provided (Please add valid Language name)"
    ]
  },
  nativeName: {
    type: String,
    required: [
      true,
      "Native Name not provided (Please add valid Language name)"
    ]
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Category slug from name
LanguageSchema.pre("validate", function(next) {
  this.slug = slugify(this.nameInEnglish, { lower: true });
  this.languageCode = ISO6391.getCode(this.nameInEnglish);
  this.nativeName = ISO6391.getNativeName(this.languageCode);
  next();
});

module.exports = mongoose.model("Language", LanguageSchema);
