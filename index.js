const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
/* const lists = require("./init.js");
const saveData = require("./saveData.js"); */
const ejsMate = require("ejs-mate");
const errorHandler = require("./utils/errorHandler.js");
const listingRoute = require("./Routes/listing.js");
const reviewRoute = require("./Routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const port = 3000;

//when you call this function connects and also provide acknowledgement like if connect was successfull then .then() will log else if any error occur then .ctach() would execute
main()
  .then((res) => console.log("BookAbode connected successful IN indexed.JS"))
  .catch((err) => console.log(err));

//Async function to make you connect with MongoDb
async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

let sessionOptions = {
  secret: "defautsecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //By-default it could lways set to true in order to prvent cross-scripting attacks
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
  res.locals.successMsg = req.flash("sucess");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute);


app.all("*", (req, res, next) => {
  next(
    new errorHandler(
      400,
      `${req.originalUrl} was not defined(Page not defined)`
    )
  );
});

app.use((err, req, res, next) => {
  let {
    statusCode = 500,
    message = `${req.originalUrl} something goes wrong on this Url`,
  } = err;
  /* res.status(statusCode).send(message); */
  res.status(statusCode).render("listing/error.ejs", { err });
});

app.listen(port, () => {
  console.log(`${port} is listening`);
});
