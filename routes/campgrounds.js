const express = require("express");
const router = express.Router();

const { upload } = require("../aws/upload.js");
const catchAsync = require("../utils/catchAsync");
const campController = require("../controllers/campgrounds.js");
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");
const Campground = require("../models/campground");

router
  .route("/")
  .get(catchAsync(campController.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campController.createCampground)
  );
keys = ["pexels-quang-nguyen-vinh-222549-2131614.jpg"];
const myBucket = process.env.BUCKET_NAME;

router.get("/new", isLoggedIn, campController.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campController.showCampground))
  .patch(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campController.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campController.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campController.renderEditForm)
);

module.exports = router;
