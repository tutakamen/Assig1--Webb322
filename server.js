var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");


// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  
  // setup a 'route' to listen on the default url path (http://localhost)
  app.get("/", function(req,res){
      res.send("Hello home<br /><a href='/Home'>Go to the home page</a>");
      res.send("Hello Listings<br /><a href='/Listings'>Go to the list page</a>");
      res.send("Hello Registrations<br /><a href='/Registration'>Go to the Registration page</a>");

  });
  
  // setup another route to listen on /about
  app.get("/Home", function(req,res){
      res.sendFile(path.join(__dirname,"/views/Home.html"));
  });
  
  app.get("/Listings", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Listings.html"));
});

app.get("/Registration", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Registration.html"));
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
