// require same modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");//MUST INSTALL BLUEBIRD  - 1:20  11/10

var bookingSchema = new Schema({
    "checkIn": Date, 
    "checkOut":Date,
    "guests": Number,
    "NumberofDays": Number,
    "Price": Number,
    "listingRoomName": String,
    "userEmail": {
        type: String,
        unique: true },

});

module.exports = mongoose.model("bookings", bookingSchema);
