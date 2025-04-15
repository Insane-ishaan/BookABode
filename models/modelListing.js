const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const Review = require('./modelReviews.js');
/* const lists = require("../models/init.js"); */

main()
  .then((res) => console.log("BookABode connected successful IN MODLELISTING.JS"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

let userSchema = new Schema({
  tittle: {
    type: String,
    require: [true,"Tittle is must to initialize"],
  },
  description: {
    type: String,
    require: [true,"Description is must to initialize"],
    minLength : [10,"Description must contain atleast 10 letter"],
    maxLength : [500,"The max length for description is of 100 words"] 
  },
  image: {
    type: String,
    default:
      "https://th.bing.com/th/id/R.fed30976f764451f3d566d29a2cb0b70?rik=oLfELwvnw5%2fZHQ&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f0%2f6%2f0%2f805006-vertical-scenery-background-1920x1080.jpg&ehk=rv7huDUPSFhgA65MrOa5%2bNIwqrjRRygcuSOtGCGpcuo%3d&risl=&pid=ImgRaw&r=0",
    set: (v) =>
      v === ""
        ? "https://th.bing.com/th/id/R.fed30976f764451f3d566d29a2cb0b70?rik=oLfELwvnw5%2fZHQ&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f0%2f6%2f0%2f805006-vertical-scenery-background-1920x1080.jpg&ehk=rv7huDUPSFhgA65MrOa5%2bNIwqrjRRygcuSOtGCGpcuo%3d&risl=&pid=ImgRaw&r=0"
        : v,
  },
  price: {
    type: Number,
    require: [true,"Price is must to initialize"]
  },
  location: {
    type: String,
    require: [true,"Location is must to initialize"]
  },
  country: {
    type: String,
    require: [true,"Country is must to initialize"]
  },
  review :[ 
  {
    type:Schema.Types.ObjectId,
    ref:"Review",
  }
]
});

userSchema.post("findOneAndDelete",async(card) => {
  if(card){
    await Review.deleteMany({_id : {$in : card.review}});
  }
});


let Listing = mongoose.model("Listing", userSchema);
module.exports = Listing;
