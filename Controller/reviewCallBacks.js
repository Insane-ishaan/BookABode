const Listing = require("../models/modelListing.js");
const Review = require("../models/modelReviews.js");

module.exports.createPostLogic = async (req, res) => {
  let { id } = req.params;
  let card = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  card.review.push(newReview); //Push this new review into cards.review array

  await card.save();
  await newReview.save();
  req.flash("sucess", "New Review Created");
  res.redirect(`/listing/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } }); //FROM REVIEW ARRAY THE THING THAT MATCHES REVIEWID REMOVE THEM
  await Review.findByIdAndDelete(reviewId);

  req.flash("error", "Oops! Another feedback gone ");
  res.redirect(`/listing/${id}`);
};
