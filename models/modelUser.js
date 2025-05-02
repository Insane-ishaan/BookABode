const { required } = require("joi");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

//Below Plugin Will Ad d username,hashing,salt field to store the username by itself and also save them by its own
userSchema.plugin(passportLocalMongoose);

let User = mongoose.model("User",userSchema);
module.exports = User;