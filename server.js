/*
your responsive design is NOT completed.  
In the video you zoomed the bwoser to make it look like it was working where it does not when I view it live
Your form processing does not work it does not post 
correctly and therefore I could not test the email nor the dashboard features
*/

/* #region REQUIRES */
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
/* #endregion */


/* #region mongoose_connections */


var db = mongoose.connect( config.dbconn  , { useNewUrlParser: true ,useUnifiedTopology: true } ) ; //can remove db 

mongoose.Promise = require("bluebird");

mongoose.connection.on("open",()=>{
    console.log("Working");
});

/* #endregion */

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

//creating user, must replace this with  a find mongodb once works 
const user = {
  Admin: true  , 
  fname : "Mustafa",
  lname : "Bukhari",
  password: "Winter22",
  email: "mustafabukhari99@gmail.com"
}

function checkLogin(req,res,next){  //must add admin logic 
  if(!req.session.user){
    res.redirect("/dashboard");
  } else {
    next(); 
  }
}


/* #region app.get_Engines */

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
          if (password === usr.password){
              req.session.user = {//creating session variable 
                  email: usr.email,
                  firstName: usr.fname,
                  lastName: usr.lname,
                  isAdmin: usr.admin
              };
              res.redirect("/dashboard");
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



/* #endregion */

/* #region app.post_Engines */









//this should be the name tag on the photo upload input tag in form  
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

      var incomingData  = new UserModel({
        admin: false,
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
        user: FORM_DATA, //try change data to user
        layout:false
      });

});

/* #endregion  */

    /* #region PROFILES */
    app.get("/Profile", checkLogin, (req,res)=>{
      res.render("Profile", {user: req.session.user, layout: false});
   });
   
   app.get("/Profile/Edit", ensureLogin, (req,res)=>{
       res.render("ProfileEdit", {user: req.session.user, layout: false});
   });
   
   app.post("/Profile/Edit", ensureLogin, (req,res) => {
       const firstName = req.body.fname;
       const lastName = req.body.lastname;
       const Email = req.body.email;
       const admin = (req.body.admin === "on");
       UserModel.updateOne(
           { email: Email },
           {$set: {
               fname: firstName,
               lname: lastName,
               email: Email,
               admin: true
           }}
       ).exec()
       .then(()=>{
           req.session.user = {
            fname: firstName,
            lname: lastName,
            email: Email,
            admin: true
        };
           res.redirect("/Profile");
       });
       
   });
   
   /* #endregion */
   








// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
