// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// use bluebird promise library with mongoose
mongoose.Promise = require("bluebird");

// define the photo schema
const photoSchema = new Schema({
  "filename": {
    type: String,
    unique: true
  },
  "listing_name": String,
  "email": String,
  "price": String,
  "city": String,
  "description": String,
  "createdOn": {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PhotoLibrary", photoSchema);