const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.Map_Token;
const geoCoder = mbxGeocoding({ accessToken: mapToken });
const { main } = require("../aws/delete");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new.ejs");
};

module.exports.createCampground = async (req, res, next) => {
  const geoCoordinates = await geoCoder
    .forwardGeocode({ query: req.body.campground.location, limit: 1 })
    .send();

  const newCampground = new Campground(req.body.campground);
  // console.log(req.files);
  newCampground.images = req.files.map((i) => ({
    url: i.location,
    fileName: i.key,
  }));
  newCampground.geometry = geoCoordinates.body.features[0].geometry;
  newCampground.author = req.user._id;

  await newCampground.save();
  req.flash("success", "Successfully created a new Campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find the Campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show.ejs", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find the Campground");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit.ejs", { campground });
};

const myBucket = process.env.BUCKET_NAME;
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const updatedCampground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    { runValidators: true }
  );
  const files = req.files; // Access all uploaded files

  
  if (files) {
    const uploadedFiles = files.map((i) => ({
      url: i.location,
      fileName: i.key,
    }));
    // console.log(uploadedFiles);
    updatedCampground.images.push(...uploadedFiles);
  }
  if (req.body.deleteImages.length) {
    const keys = req.body.deleteImages;
    main({ myBucket, keys });
    await updatedCampground.updateOne({
      $pull: { images: { fileName: { $in: req.body.deleteImages } } },
    });
    // console.log(updatedCampground);
  }
  await updatedCampground.save();
  req.flash("success", "Successfully updated!!!");
  res.redirect(`/campgrounds/${updatedCampground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully Deleted");
  res.redirect("/campgrounds");
};
