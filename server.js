var express = require("express"); 
var app = express();
var path = require("path");
var multer = require("multer");
var nodemailer = require("nodemailer");

var HTTP_PORT = process.env.PORT || 8080;

const STORAGE = multer.diskStorage({
  destination: "./public/photos/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const UPLOAD = multer({storage: STORAGE}); 

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

app.use(express.static("views"));
app.use(express.static("public"));

  // setup a 'route' to listen on the default url path 
  app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Home.html"));
  });
  
  app.get("/Listings", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Listings.html"));
});

app.get("/contact", function(req,res){
  res.sendFile(path.join(__dirname,"/views/contact.html"));
});


//this should be the name tag on the photo upload input tag in form  
app.post("/contact-form-process", UPLOAD.single("photo")),(req,res)=> {
  const FORM_DATA = req.body ; 
  const FORM_FILE = req.file ;  

  const DATA_RECEIVED =  " Your submissionm was received:<br>/br" + 
    "Your form  data was: <br/>"  + JSON.stringify(FORM_DATA)  + "<br/><br>" +  
    "Your file  data was: <br/>"  + JSON.stringify(FORM_FILE)  + 
    "<br/><P>THIS WAS THE IMAGE UPLOADED :<BR/>" + 
    "<IMG SRC='/photos/"  + FORM_FILE.filename  +  "'/>"  +
    "<br/><br/>Welcome <strong>"  + FORM_DATA.fname + " " +  FORM_DATA.lname + "</strong>" + 
    "to the world of form processing."

    res.send(DATA_RECEIVED); 
}

var mailOptions =  {
  from: 'webb322assigment2@gmail.com',
  to: 'webb322assigment2@gmail.com',    
  subject: 'Welcome to StayAnywhere',
  html: '<p>Hello' + ":<p>Thank  you for contacting us  RRFRF</p>"

}

transporter.sendMail(mailOptions,(error,info) =>{
  if(error){
  console.log("ERROR: "+ error);
  }else{
    console.log("Email sent: " +info.response ); 
  }

}); 

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
