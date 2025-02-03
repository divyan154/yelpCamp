if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const session = require("express-session");
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");

const passport = require("passport");
const localStrategy = require("passport-local");

const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");

const DB_URL = process.env.db_url || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(DB_URL);

const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const Campground = require("./models/campground");
const Review = require("./models/review.js");
const User = require("./models/user.js");

const campgroundRouter = require("./routes/campgrounds.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/auth.js");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const MongoStore = require("connect-mongo");

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const secret = process.env.secret || "thisisnotgoodsecretkey";
const sessionConfig = {
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false,
  },
  store: new MongoStore({
    mongoUrl: DB_URL, // Your MongoDB URL
    secret,
    touchAfter: 24 * 3600, // Time interval to reset expiration
  }),
};
app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// app.get("/login", (req, res) => {
//   req.session.user = 123;
//   res.send("Cookie is set");
// });

app.use((req, res, next) => {
  // console.log(`req.session.returnTo":,${req.session.returnTo}`);
  console.log(req.query);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/", userRouter);

app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.all("*", (req, res, next) => {
  throw next(new ExpressError("Page not Found", 500));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something is Wrong!!";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
