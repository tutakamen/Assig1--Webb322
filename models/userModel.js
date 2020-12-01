// require same modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");//MUST INSTALL BLUEBIRD  - 1:20  11/10

var UserSchema = new Schema({
    "userName": String,
    "fname": String,
    "lname": String,
    "SIN": {
        "type": Number,
        "default": 0},
    "DOB": Date
});

module.exports = mongoose.model("Users", UserSchema);
