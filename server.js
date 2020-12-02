/*
your responsive design is NOT completed.  
In the video you zoomed the bwoser to make it look like it was working where it does not when I view it live
Your form processing does not work it does not post 
correctly and therefore I could not test the email nor the dashboard features
*/
var express = require("express"); 
var app = express();
var path = require("path");
var multer = require("multer");
var nodemailer = require("nodemailer");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions")
var  mongoose  = require("mongoose")  ; 
var  Schema  = mongoose.Schema  ; 
var UserModel = require("./models/userModel"); 
const config  = require("./js/config"); 

var db = mongoose.connect( config.dbconn  , { useNewUrlParser: true ,useUnifiedTopology: true } ) ; 

mongoose.Promise = require("bluebird");

mongoose.connection.on("open",()=>{
    console.log("Working");
});

var HTTP_PORT = process.env.PORT || 8080;

var upload = multer({ dest: './public/data/' })

var transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'webb322assigment2@gmail.com',
    pass: 'Winter2020'
  }
})

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(express.static("views"));
app.use(express.static("public"));

app.use(clientSessions({
  cookieName: "session",
  secret: "web322_week9_sessionDemo",
  duration: 2*60*1000, 
  activeDuration: 1000*60
})); 

//creating user, must replace this with  a find mongodb once works 
const user = {
  username:"mustafabukhari99@gmail.com",
  password: "Winter22",
  email: "mustafabukhari99@gmail.com"
}

function checkLogin(req,res,next){  //must add admin logic 
  if(!req.session.user){
    res.redirect("/login");
  } else {
    next(); 
  }
}


// setup a 'route' to listen on the default url path 
app.get("/", (req,res) => {
  res.render('Home',{user:req.session.user , layout:false}); 
});
app.get("/about", (req,res) => {
  res.render('about',{user:req.session.user , layout:false}); 
});

app.get("/search", function(req,res){
  res.render('search',{user:req.session.user ,layout:false});
});

app.get("/Listings", function(req,res){
  res.render('Listings',{user:req.session.user ,layout:false});
});

app.get("/contact", function(req,res){
  res.render('contact',{user:req.session.user ,layout:false});
});

app.get("/login", function(req,res){
  res.render('login',{user:req.session.user, layout:false});
});


app.get("/dashboard", checkLogin ,function(req,res){
  res.render('dashboard',{
    user:req.session.user, 
    layout:false});
});

app.post("/login",upload.none(), (req,res)=>{
  
  const username =  req.body.email ; 
  const password =  req.body.password ; 
  //serverside validation
  if(username===""|| password === ""){
    return res.render("login",{ errorMsg: "Both fields are required" , user:req.session.user, layout:false });  //already done this on hbs page
  }

  if(username === user.username && password === user.password ){
    req.session.user = {
      username:user.username,
      email:user.email
    };
    return res.redirect("/dashboard"); 
  }
  else{
    res.render("login", {errorMsg: "login and password dont match",user:req.session.user,layout:false});
  }
});


//this should be the name tag on the photo upload input tag in form  
app.post("/contact-form-process",upload.none(), (req,res)=> {
  var FORM_DATA = req.body ; //only text 

    var mailOptions =  {
      from: 'webb322assigment2@gmail.com',
      to: FORM_DATA.email ,    
      subject: 'Welcome to StayAnywhere',
      html: `Hello ${req.body.fname}, welcome to StayAnywhere! `
    }
    
      transporter.sendMail(mailOptions,(error,info) =>{
        if(error){
        console.log("ERROR: "+ error);
        }else{
          console.log("Email sent: " +info.response ); 
        }
      }); 

      var incomingData  = new UserModel({
        fname: req.body.fname,
        lname:  req.body.lname,
        email :  req.body.email,
        password : req.body.password,
    });  
    
    incomingData.save((err) => {
      if(err) {
        console.log("There was an error saving the  shit");
      } else {
          console.log("saved to the web322e collection");
      }   
    });

      res.render('dashboard',{
        data: FORM_DATA, //try change data to user
        layout:false
      });

});


app.get("/logout", (req,res)=>{
  req.session.reset(); 
  res.redirect("/");
}); 


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
