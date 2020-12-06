/* #region REQUIRES */
var express = require("express"); 
var app = express();
var path = require("path");
var multer = require("multer");
var nodemailer = require("nodemailer");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions")
var  mongoose  = require("mongoose")  ; 
const config  = require("./js/config"); 
var bodyParser = require("body-parser");
require('dotenv').config()
const bcrypt = require('bcryptjs');
const _ = require ("underscore"); 
const fs = require("fs"); 

const PHOTODIRECTORY = "./public/photos/";

const userRoom = require("./models/userRoom");
var  Schema  = mongoose.Schema  ; 
var UserModel = require("./models/userModel"); 

/* #endregion */

/* #region mongoose_connections */

var db = mongoose.connect( config.dbconn  , { useNewUrlParser: true ,useUnifiedTopology: true } ) ; //can remove db 

mongoose.Promise = require("bluebird");

mongoose.connection.on("open",()=>{
    console.log("Working");
});

/* #endregion */

/* #region Utility declaration and functions  */
if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
}

const saltRounds = 2;

const storage = multer.diskStorage({
  destination: PHOTODIRECTORY,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({extended: false }));

var HTTP_PORT = process.env.PORT || 8080;

// var upload = multer({ dest: './public/data/' }) //commented to use above one 

var transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'webb322assigment2@gmail.com',
    pass:  config.GmailPassword
  }
})

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

function checkLogin(req,res,next){  //must add admin logic 
  if(!req.session.user){
    res.redirect("/login");
  } else {
    next(); 
  }
}

function checkAdmin(req,res,next){  //use to check whetehr admin or not.  
  if(!req.session.user.admin){
    res.redirect("/dashboard");
  } else {
    next(); 
  }
}

/* #endregion */

/* #region app.get/POST Engines */
    
    /* #region static_setup */
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(express.static("views"));
app.use(express.static("public"));

      /* #endregion */

    /* #region Session */

app.use(clientSessions({
  cookieName: "session",
  secret: "web322_week9_sessionDemo",
  duration: 2*60*1000, 
  activeDuration: 1000*60
})); 


      /* #endregion */

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

app.get("/login", function(req,res){
  res.render('login',{ layout:false});
});

app.post("/login",upload.none(), (req,res)=>{
  
  const email =  req.body.email ; 
  const password =  req.body.password ; 
  //serverside validation
  if(email===""|| password === ""){
    return res.render("login",{ errorMsg: "Somethings missing, or put in incorrectly" , layout:false });  //already done this on hbs page
  }

  UserModel.findOne({email: email})
  .exec()// turns this into a promise
  .then((usr) => {
      if (!usr) {
          res.render("login", {errorMsg: "login does not exist!", layout: false});
      } else {
          // user exists
          const validPassword = bcrypt.compare(req.body.password, usr.password);
          if (validPassword){
              req.session.user = {//creating session variable 
                  email: usr.email,
                  fname: usr.fname,
                  lname: usr.lname,
                  admin: usr.admin
              };
              if (usr.admin) {
                res.redirect("/adminDashboard");
              }else{
                res.redirect("/dashboard");
              }
          } else {
              res.render("login", {errorMsg: "login and password does not match!", layout: false});
          };
      };

  })
  .catch((err) => { console.log("An error occurred: ${err}")});



});

app.get("/dashboard", checkLogin ,function(req,res){
  res.render('dashboard',{
    user:req.session.user, 
    layout:false});
});

app.get("/adminDashboard", checkLogin ,function(req,res){
  res.render('adminDashboard',{
    user:req.session.user, 
    layout:false});
});

app.get("/logout", (req,res)=>{
  req.session.reset(); 
  res.redirect("/");
}); 

app.get("/firstrunsetup", (req,res)=> {
  var Administrator = new UserModel({
      admin: true, 
      fname : "Mustafa",
      lname : "Bukhari",
      password: "Winter22",
      email: "mustafabukhari99@gmail.com"
    });
  console.log("got here!");
  Administrator.save((err)=> {
      console.log("Error: " + err + ';');
      if (err) {
          console.log("There was an error creating Clint: " + err);
      } else {
          console.log("Admin is created");
      }
  });
  console.log("got here 2!");
  res.redirect("/");
})

app.get("/createListings", (req, res) => {
  // send the html view with our form to the client
  res.render("createListings", { 
    layout: false // do not use the default Layout (main.hbs)
  });
});

app.post("/createListings", upload.single("photo"), (req, res) => {
  const locals = { 
    message: "Your photo was uploaded successfully",
    layout: false // do not use the default Layout (main.hbs)
  };

  const newRoom = new userRoom({
    Listing_name: req.body.name,
    price:req.body.price , 
    email: req.body.email,
    city:req.body.city,
    description: req.body.desc,
    filename: req.file.filename  
  });

  newRoom.save()
  .then((response) => {
    res.render("dashboard", locals);
  })
  .catch((err) => {
    locals.message = "There was an error uploading your photo";

    console.log(err);

    res.render("dashboard", locals);
  });
});

app.get("/contact", function(req,res){
  res.render('contact',{user:req.session.user ,  layout:false});
});

app.post("/contact-form-process",upload.none(), (req,res)=> {
  var FORM_DATA = req.body ; //only text 

    var mailOptions =  {
      from: 'webb322assigment2@gmail.com',
      to: FORM_DATA.email ,    
      subject: 'Welcome to StayAnywhere',
      html: `Hello ${FORM_DATA.fname}, welcome to StayAnywhere!`
    }
    
    transporter.sendMail(mailOptions,(error,info) =>{
        if(error){
        console.log("ERROR: "+ error);
        }else{
          console.log("Email sent: " +info.response ); 
        }
      }); 


                  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

                  var incomingData  = new UserModel({
                      admin: false,
                      fname: req.body.fname,
                      lname:  req.body.lname,
                      email :  req.body.email,
                      password : hash,
                  });  

                  incomingData.save((err) => {
                    if(err) {
                      console.log("There was an error saving the shit");
                    } else {
                        console.log("saved to the web322e collection");
                    }   
                  });
              
                  }) ; 
                          

    res.render('dashboard',{
        user: FORM_DATA, //try change data to user
        layout:false
      });

});

app.get("/profile", checkLogin, (req,res)=>{
  res.render("profile", {user: req.session.user, layout: false});
});

app.get("/profile/edit", checkLogin, (req,res)=>{
    res.render("profileedit", {user: req.session.user, layout: false});
});

app.post("/profile/edit",upload.none(), checkLogin, (req,res) => { //  multer  none 
    const firstName = req.body.fname ;//problem here 
    const lastName = req.body.lname;
    const Email = req.body.email;
    const OldEmail = req.body.oldEmail;
    const admin = (req.body.admin === "on");
    UserModel.updateOne(
        { email: OldEmail },//old email to find what to update
        {$set: { // updating values    
        admin: true,
        fname: firstName, 
        lname: lastName,
        email: Email  
        }}
    ).exec()
    .then(()=>{
        req.session.user = {
        fname: firstName,
        lname: lastName,
        email: Email,
        admin: true
    };
        res.redirect("/profile");
    });
    
});
   
   /* #endregion */

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
