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

// setup a 'route' to listen on the default url path 
app.get("/", (req,res) => {
  res.render('Home',{layout:false}); 
});
app.get("/about", (req,res) => {
  res.render('about',{layout:false}); 
});

app.get("/Listings", function(req,res){
  res.render('Listings',{layout:false});
});

app.get("/contact", function(req,res){
  res.render('contact',{layout:false});
});
app.get("/dashboard", function(req,res){
  res.render('dashboard',{layout:false});
});






//this should be the name tag on the photo upload input tag in form  
app.post("/contact-form-process",upload.none(), (req,res)=> {
  var FORM_DATA = req.body ; //only text 

    var mailOptions =  {
      from: 'webb322assigment2@gmail.com',
      to: FORM_DATA.email ,    
      subject: 'Welcome to StayAnywhere',
      html: '<p>Hello ' +  ":<p>Thank you for staying with us</p>"
    }
    
      transporter.sendMail(mailOptions,(error,info) =>{
        if(error){
        console.log("ERROR: "+ error);
        }else{
          console.log("Email sent: " +info.response ); 
        }
      }); 

      res.render('dashboard',{
        data: FORM_DATA,
        layout:false
      });

});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
