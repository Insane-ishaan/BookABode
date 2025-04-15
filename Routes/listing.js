const express = require("express");
const router = express.Router();
const asyncWrapp = require("../utils/asyncWrap.js");
const Listing = require("../models/modelListing.js");
const { ValidateList } = require("../serverValidationJoi.js");
const errorHandler = require("../utils/errorHandler.js");

const serverSideValitdation = (req, res, next) => {
  let validatingEnterData = ValidateList.validate(req.body.details);
  if (validatingEnterData.error) {
    console.log(validatingEnterData.error);
    const error = validatingEnterData.error.details.map((el) => el.message);
    throw new errorHandler(400, error);
  } else {
    next();
  }
};

//A page that displays all cards route(INDEX ROUTE)
router.get(
  "/",
  asyncWrapp(async (req, res) => {
    const allData = await Listing.find({});
    res.render("listing/home.ejs", { allData });
  })
);

//A route to initialize new card(NEW ROUTE)
router.get("/new", (req, res) => {
  res.render("listing/new.ejs"); //This take you route to new page
});

//Route Which actually take data (in form of Url from new.ejs) And adds it main Index Page
router.post(
  "/",
  serverSideValitdation,
  asyncWrapp(async (req, res) => {
    /* let {
    tittle: heading,
    description: content,
    price: rate,
    location: loc,
    country: con,
  } = req.body;
  let newData = await new model({
    tittle: heading,
    description: content,
    price: rate,
    location: loc,
    country: con,
  });
  newData
    .save()
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  res.redirect("/cards");
}); */ //This is the First[Typically Lengthy] to take inserted data and add it to make index Page
    //The ANOTHER Method will be : ->
    let fetchData = new Listing(req.body.listing); //Here i made an listing named array in which i mention all the names from which js server indetiify in which input there will be this value in like name=listing[content here]
    // Save the data to the database (validation happens automatically here)
    await fetchData.save();
    req.flash("sucess", "New Trip Got Added");
    res.redirect("/listing");
  })
);

//A route to see dedicated one card(DETAIL/SHOW ROUTE)
/* router.get(
  "/:id",
  asyncWrapp(async (req, res, next) => {
    let { id } = req.params;
    id = id.trim();
    const allData = await Listing.findById(id).populate("review");
    if (!allData) {
      req.flash("error", "Requested Trip Info Not Found");
      return res.redirect("/listing");
    }
    res.render("listing/detail.ejs", { data: allData });
  })
); */

router.get(
  "/:id",
  asyncWrapp(async (req, res, next) => {
    let { id } = req.params;
    id = id.trim();

    const allData = await Listing.findById(id).populate("review");

    if (!allData) {
      req.flash("error", "Requested Trip Info Not Found");
      return res.redirect("/listing");
    }

    res.render("listing/detail.ejs", { data: allData });
  })
);

//Edit route which makes you route to edit.ejs for upgradation
router.get(
  "/edit/:id",
  asyncWrapp(async (req, res) => {
    let { id } = req.params;
    let dataGetByid = await Listing.findById(id);
    if (!dataGetByid) {
      req.flash("error", "Requested Trip Info Not Found");
      return res.redirect("/listing");
    }
    res.render("listing/edit.ejs", { data: dataGetByid });
  })
);

router.put(
  "/:id",
  serverSideValitdation,
  asyncWrapp(async (req, res) => {
    /* let fetchData = new Listing(req.body.listing);
      await fetchData.save(); */
    /*  
    let {
      tittle: heading,
      description: content,
      price: rate,
      location: loc,
      country: con,
    } = req.body;
      // Remove the currency symbol from the price
      if (typeof rate === 'string' && rate.startsWith('₹')) {
        rate = rate.replace('₹', '').trim();
      }
    
      // Convert the price to a number
      rate = parseInt(rate);
    let FetchUpadteData = {
      tittle: heading,
      description: content,
      price: rate,
      location: loc,
      country: con,
    }; */

    //ANOTHER METHOD TO IMPLEMENT PUT METHOD
    let { id } = req.params;
    let { price: rate } = req.body.listing;

    let data = await Listing.findByIdAndUpdate(
      `${id}`,
      { ...req.body.listing },
      { runValidators: true, new: true }
    );
    /* This makes rupee sign in front of price user had entered */
    rate.startsWith("&#x20b9;");
    /*   // Remove the currency symbol from the price
      if (typeof rate === "string" && rate.startsWith("&#x20b9;")) {
        rate = rate.replace("₹", "").trim();
      }
      // Convert the price to an integer
      rate = parseInt(rate, 10);
      // Update the price in the listing object*/
    req.body.listing.price = rate;
    /*   console.log(data); */
    res.redirect(`/listing/${id}`);
  })
);
/* //A route to see dedicated one card(DETAIL ROUTE)
  app.get("/cards/:id", async (req, res,next) => {
    let { id } = req.params;
    const allData = await model.findById(id);
    if(!allData){
      next(new errorHandler(401,`Is not valid id`));
    }
    res.render("listing/detail.ejs", { data: allData });
  }); */

//ROUTE to Delete Card From Show(Detail.ejs) Route
router.delete(
  "/:id",
  asyncWrapp(async (req, res) => {
    let { id } = req.params;
    let dataToBeDeleted = await Listing.findByIdAndDelete(id);
    console.log(`${id} id data successfully deleted`);
    /* console.log(dataToBeDeleted); */
    req.flash("error", "Oops!! Another Trip Flew Away");
    res.redirect("/listing");
  })
);

module.exports = router;
