const Listing = require("./models/modelListing");
const Review = require("./models/modelReviews.js");
const { ValidateList } = require("./serverValidationJoi.js");
const errorHandler = require("./utils/errorHandler.js");

module.exports.isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl =
      req.originalUrl; /*But here when this middleware exports in user.js 
   then passport by-default delete the originalUrl from sessions ... SOO we create another middleware below*/
    req.flash("error", "Login in Required");
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwned = async (req, res, next) => {
  let { id } = req.params;
  let fechData = await Listing.findById(id);
  if (!fechData.owner.equals(res.locals.currUser._id)) {
    console.log("Not Authenticated");
    req.flash("error", "You Have No permission");
    return res.redirect(`/listing/${id}`);
  }
  next();
};


module.exports.isAuthor = async (req, res, next) => {
  let { id,reviewId } = req.params;
  let card = await Review.findById(reviewId);
  if (!card.author.equals(res.locals.currUser._id)) {
    console.log("Not Authenticated");
    req.flash("error", "You Have No permission");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.redirectUrlAfterLogin = (req, res, next) => {
  if (req.session.redirectUrl) {
    //If there is any redirectUrl was saved in request sessions THEN
    res.locals.redirectUrl = req.session.redirectUrl; //Soo here we initialize this URL in locals Becoz it is accessible in whole files
  }
  next();
};


module.exports.serverSideValitdation = (req, res, next) => {
  let validatingEnterData = ValidateList.validate(req.body.details);
  if (validatingEnterData.error) {
    console.log(validatingEnterData.error);
    const error = validatingEnterData.error.details.map((el) => el.message);
    throw new errorHandler(400, error);
  } else {
    next();
  }
};