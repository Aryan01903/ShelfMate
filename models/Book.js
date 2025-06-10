const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    openLibraryId: {
        type: String,
        unique: true,
        sparse: true, //important to avoid error if value is missing
    },
    author_key: {
        type: String,
        sparse: true, //important to avoid error if value is missing
    },
    work_key: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: [String],
      default: ["Unknown"],
    },
    description: {
      type: String,
      default: "No description available",
    },
    coverImage: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    subjects: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);