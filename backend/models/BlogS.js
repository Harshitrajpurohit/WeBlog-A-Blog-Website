const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String, // URL or path to Cloudinary/Firebase
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
    category: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
