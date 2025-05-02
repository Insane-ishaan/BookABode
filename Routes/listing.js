const express = require("express");
const router = express.Router();
const asyncWrapp = require("../utils/asyncWrap.js");
const listngCallbacks = require("../Controller/listingCallBacks.js");
const {upload} = require('../cloudConfig.js');

const {
  isLogged,
  isOwned,
  serverSideValitdation,
} = require("../middlewares.js");

router.route("/")
/*A page that displays all cards route(INDEX ROUTE) */
.get(asyncWrapp(listngCallbacks.index))
/*Route Which actually take data (in form of Url from new.ejs) And adds it main Index Page*/
.post(isLogged,serverSideValitdation,upload.single("listing[image]"),asyncWrapp(listngCallbacks.createPostLogic))

//A route to initialize new card(NEW ROUTE)
router.get("/new", isLogged, listngCallbacks.createGetLogic);


router.get("/category", asyncWrapp(listngCallbacks.filteredCard));

//Edit route which makes you route to edit.ejs for upgradation
router.get(
  "/edit/:id",
  isLogged,
  isOwned,
  asyncWrapp(listngCallbacks.updateGetLogic)
);

router.route("/:id")
/*Edit Route Which Perform Actual Logic For updation On-Behalf Of Recived Data from edit.ejs*/ 
.put(isLogged,isOwned,serverSideValitdation,upload.single("listing[image]"),asyncWrapp(listngCallbacks.updatePutLogic))
/*ROUTE to Delete Card From Show(Detail.ejs) Route*/
.delete(isLogged, isOwned, asyncWrapp(listngCallbacks.delete))
/*A route to see dedicated one card(DETAIL/SHOW ROUTE)*/
.get(asyncWrapp(listngCallbacks.showGetLogic))

module.exports = router;
