const { fileLoader } = require("ejs");
const Listing = require("../models/modelListing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_API_TOKEN });
const allowedCategories = Listing.schema.path('category').enumValues;

module.exports.index = async (req, res) => {
  const allData = await Listing.find({});
  res.render("listing/home.ejs", { allData });
};

module.exports.createGetLogic = (req, res) => {
  res.render("listing/new.ejs"); //This take you route to new page
};

module.exports.createPostLogic = async (req, res) => {
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
  
  //TO SET GEOMETRY LOCATION FOR MAPS
  let geomteryResult = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send();


  let url = req.file.path;
  let filename = req.file.filename;
  fetchData.owner = req.user._id;
  fetchData.image = {url,filename}
  fetchData.category = req.body.listing.category;
  fetchData.geometry = geomteryResult.body.features[0].geometry;
  if(!fetchData.category){
    req.flash("error","Category Field Required");
    return res.redirect("/listing/new");
  }
  await fetchData.save();
  req.flash("sucess", "New Trip Got Added");
  res.redirect("/listing");
}; 

module.exports.showGetLogic = async (req, res, next) => {
  let { id } = req.params;
  id = id.trim();

  const allData = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");

  if (!allData) {
    req.flash("error", "Requested Trip Info Not Found");
    return res.redirect("/listing");
  }

  res.render("listing/detail.ejs", { data: allData });
};

module.exports.updateGetLogic = async (req, res) => {
  let { id } = req.params;
  let dataGetByid = await Listing.findById(id);
  if (!dataGetByid) {
    req.flash("error", "Requested Trip Info Not Found");
    return res.redirect("/listing");
  }
  let originalImg = dataGetByid.image.url;
  let modifiedImg = originalImg.replace("/upload","/upload/w_600/h_280/q_auto:low");
  res.render("listing/edit.ejs", { data: dataGetByid , img : modifiedImg});
};

module.exports.updatePutLogic = async (req, res) => {
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
  /* This makes Rupee sign in front of price user had entered */
   rate.startsWith("&#x20b9;"); 
     // Remove the currency symbol from the price
      if (typeof rate === "string" && rate.startsWith("&#x20b9;")) {
        rate = rate.replace("₹", "").trim();
      }
      // Convert the price to an integer
      rate = parseInt(rate, 10);
      // Update the price in the listing object
  req.body.listing.price = rate;
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    data.image = {url,filename};
    await data.save();
  }
  req.flash("sucess","Trip Detail Updated!");
  res.redirect(`/listing/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let dataToBeDeleted = await Listing.findByIdAndDelete(id);
  console.log(`${id} id data successfully deleted`);
  /* console.log(dataToBeDeleted); */
  req.flash("error", "Oops!! Another Trip Flew Away");
  res.redirect("/listing");
};

module.exports.filteredCard = async (req,res) => {
  let {type} = req.query;
  const typeCard = await Listing.find({category : type});
  if(!type || !allowedCategories.includes(type)){
    req.flash("error","Requested Category Trip Not Found");
    return res.redirect("/listing")
  }  
  res.render("listing/filterCard.ejs", {typeCard , type});
};
