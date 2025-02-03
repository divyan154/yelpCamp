const User = require("../models/user");
module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register.ejs");
};

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    //   console.log(registeredUser);
    req.login(registeredUser, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "User is registered Successfully");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome Back!!");
  // console.log(`Inside login route: ${req.session.returnTo}`);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;

  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
