var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const multer = require("multer");
const { extname } = require("path");
var app = express();
var path = require("path");
// app.use('/', express.static(path.join(__dirname, 'views')));
app.use(express.static("views"));
app.use(express.static("public"));
var nodemailer = require("nodemailer")
const  STORAGE = multer.diskStorage({

destination = "./public/photos/",
filename: function(req,file,cb){
  cb(null,Date.now() + path,extname(file.originalname)); 
}
})

const UPLOAD = multer({storage:STORAGE}); 


var transporter = nodemailer.createTransport({
service: 'gmail', 
auth: {
  user: 'web322clint@gmail.com',
  pass: 'ClintW3b'
}

})


// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  
  // setup a 'route' to listen on the default url path (http://localhost)
  app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Home.html"));
  });
  
  app.get("/Listings", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Listings.html"));
});

//this should be the name tag on the photo upload input tag in form  
app.post("/contact-form-process", UPLOAD.single("photo")),(req,res)=> {
  const FORM_DATA = req.body ; = 

  const FORM_FILE =  req.file ;  

  const DATA_RECEIVED =  " Your submissionm was received:<br>/br" + 
    "Your form  data was: <br/>"  + JSON.stringify(FORM_DATA)  + "<br/><br>" +  
    "Your file  data was: <br/>"  + JSON.stringify(FORM_FILE)  + 
    "<br/><P>tHIS WAS THE IMAGE UPLOADED :<BR/>" + 
    "<IMG SRC='/photos/"  + FORM_FILE.filename  +  "'/>"  +
    "<br/><br/>Welcome <strong>"  + FORM_DATA.fname + " " +  FORM_DATA.lname + "</strong>" + 
    "to  the world of form processing."


    res.send(DATA_RECEIVED); 
}

var mailOptions =  {
  from: 'Web322Clint@gmail.com',
  to:FORM_DATA.email,
  subject: 'Test email from NODE.js using nodemailer',
  html: '<p>Hello' +  FORM_DATA.fname+ ":<p>Thank  you for contacting us</p>"

}


transporter.sendMail(mailOptions,(error,info) =>{
  if(error){
  console.log("ERROR: "+ error);
  }else{
    console.log("SUCCESS: " +info.response ); 
  }

}); 


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
