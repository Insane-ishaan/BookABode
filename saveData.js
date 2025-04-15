const mongoose = require("mongoose");
const lists = require("./init.js");
const listingData = require("./models/modelListing.js");

main()
  .then((res) => console.log("Airbnb connected successful IN  SAVEDATA.JS"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

const db = async () => {
  try {
    await listingData.insertMany(lists.data);
    console.log("data addded");
  } catch (e) {
    console.log(e);
  } /*IF YOU FACE ANY PROBLEM RELATED TO DATA JUST DELETE ALL STORED DATA IN INIT.JS ONCE and AFTER FIXING THAT CAUSE a=AGAIN INSERT ALL*/
 /*  await listingData.deleteMany({});
  console.log("data deleted sucessfully"); */
};

db();
