const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapp = require("../utils/asyncWrap.js");
const { ValidateReview } = require("../serverValidationJoi.js");
const Listing = require("../models/modelListing.js");
const Review = require("../models/modelReviews.js");
const errorHandler = require("../utils/errorHandler.js");

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
  serverSideValitdationReview,
  asyncWrapp(async (req, res) => {
    let { id } = req.params;
    let card = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    card.review.push(newReview); //Push this new review into cards.review array

    await card.save();
    await newReview.save();

    res.redirect(`/listing/${id}`);
  })
);

//DELETE ROUTE(FOR REVIEW) TO DELETE REVIEWS CARD
router.delete(
  "/:reviewId",
  serverSideValitdationReview,
  asyncWrapp(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } }); //FROM REVIEW ARRAY THE THING THAT MATCHES REVIEWID REMOVE THEM
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
  })
);

module.exports = router;
