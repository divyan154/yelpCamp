const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;
const imagesSchema = new Schema({
  url: String,
  fileName: String,
});
// imagesSchema.virtual("thumbnail").get(function () {
//   return this.url.replace("/upload", "/upload/w_200");
// });
const campgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  images: [imagesSchema],
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});
campgroundSchema.set("toJSON", { virtuals: true });
campgroundSchema.virtual("properties.popupMarkup").get(function () {
  return `<strong><a href='/campgrounds/${
    this._id
  }'>${this.title}</a></strong> <p>${this.description.slice(0, 40.)}...</p>`;
});

campgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = new mongoose.model("Campground", campgroundSchema);
