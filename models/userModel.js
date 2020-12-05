// require same modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");//MUST INSTALL BLUEBIRD  - 1:20  11/10

var UserSchema = new Schema({
    "admin": Boolean,
    "fname": String,
    "lname": String,
    "email": {
        type: String,
        unique: true },
    "password": String,
});

module.exports = mongoose.model("Users1", UserSchema);
