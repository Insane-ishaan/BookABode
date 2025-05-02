const User = require("../models/modelUser");

module.exports.signUpRender = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signUpLogic = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    //To register this new to DB
    let registeredUser = await User.register(newUser, password);
    /* console.log(registeredUser); */
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("sucess", "Welcome to BookABode");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", `${e.message}`);
    res.redirect("/signup");
  }
};

module.exports.loginLogic = async (req, res) => {
  req.flash("sucess", "Welcome back Adventurer");
  let Url =
    res.locals.redirectUrl || "/listing"; /*If redirectUrl middleware don't 
    Trigger(middleware.js func) Like if user directlt log in then this func didn't trigger and in that case 
    by this OR gate it will redirect to /listing(Home page)*/
  res.redirect(Url);
};

module.exports.loginRender = (req, res) => {
  res.render("user/login.ejs");
}

module.exports.logoutLogic = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash(
      "sucess",
      "Bye Bye ... We’ll soon meet while planning an amazing trip together"
    );
    res.redirect("/listing");
  });
};
