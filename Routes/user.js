const express = require("express");
const router = express.Router();
const asyncWrapp = require("../utils/asyncWrap.js");
const passport = require("passport");
const { redirectUrlAfterLogin } = require("../middlewares.js");
const userCallBacks = require("../Controller/userCallBacks.js");

router
  .route("/signup")
  .get(userCallBacks.signUpRender)
  .post(asyncWrapp(userCallBacks.signUpLogic));

router
  .route("/login")
  .get(userCallBacks.loginRender)
  .post(
    redirectUrlAfterLogin,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userCallBacks.loginLogic
  );

router.get("/logout", userCallBacks.logoutLogic);

module.exports = router;
