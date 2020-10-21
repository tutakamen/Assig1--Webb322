var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");




// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }


//??
app.use(express.static("views"));
// app.use(express.static("static")); < ---- Use this instead  ? 
// app.use('/static', express.static(path.join(__dirname, 'views')));

  // setup a 'route' to listen on the default url path (http://localhost)
  app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Home.html"));
  });
  
  app.get("/Listings", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Listings.html"));
});


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
