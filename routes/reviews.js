const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { validateReviews, isLoggedIn } = require("../middleware.js");
const Campground = require("../models/campground");
const Review = require("../models/review.js");
const reviewController = require("../controllers/reviews.js");
const { reviewSchema } = require("../schemas.js");

router.post(
  "/",
  isLoggedIn,
  validateReviews,
  catchAsync(reviewController.createReview)
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  catchAsync(reviewController.deleteReview)
);
module.exports = router;
