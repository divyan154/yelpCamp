const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const authController = require("../controllers/auth");

router
  .route("/register")
  .get(authController.renderRegisterForm)
  .post(catchAsync(authController.register));

router
  .route("/login")
  .get(authController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    authController.login
  );
router.get("/logout", authController.logout);
module.exports = router;
