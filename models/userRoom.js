// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// use bluebird promise library with mongoose
mongoose.Promise = require("bluebird");

// define the photo schema
const Room = new Schema({
  "filename": {
    type: String,
    unique: true
  },

  "roomName": String,
  "price": String,
  "description": String,
  "location": String,
  "link":String

});

module.exports = mongoose.model("roomLibrary", Room);