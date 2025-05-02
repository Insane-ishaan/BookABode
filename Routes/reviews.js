const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapp = require("../utils/asyncWrap.js");
const { ValidateReview } = require("../serverValidationJoi.js");
const reviewCallbacks = require("../Controller/reviewCallBacks.js");
const errorHandler = require("../utils/errorHandler.js");
const {isLogged,isAuthor} = require("../middlewares.js");

const serverSideValitdationReview = (req, res, next) => {
  let validatingEnterData = ValidateReview.validate(req.body.details);
  if (validatingEnterData.error) {
    console.log(validatingEnterData.error);
    const errMsg = validatingEnterData.error.details.map((el) => el.message);
    throw new errorHandler(400, errMsg);
  } else {
    next();
  }
};

//CREATE ROUTE FOR REVIEWS
router.post(
  "/",
  isLogged,
  serverSideValitdationReview,
  asyncWrapp(reviewCallbacks.createPostLogic));

//DELETE ROUTE(FOR REVIEW) TO DELETE REVIEWS CARD
router.delete(
  "/:reviewId",
  isLogged,
  isAuthor,
  serverSideValitdationReview,
  asyncWrapp(reviewCallbacks.delete));

module.exports = router;
