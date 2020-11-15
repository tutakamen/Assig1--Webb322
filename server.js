var express = require("express"); 
var app = express();
var path = require("path");
var multer = require("multer");
var nodemailer = require("nodemailer");
const exphbs = require("express-handlebars");
////////////////////////////////////////////////////////////////////////////////////////
const Sequelize = require('sequelize');  // new 

// const {SequelizeScoreError}  = require('sequelize')  ;  //new 

//new  -  
var sequelize = new Sequelize('dbbm09qs7md1fe', 'aknqaavjrsghwv', '88f328d7e112ab84bc03a3ade0bb594c9c7194217f7fb49bdb10cb5581bf3f18', {
  host: 'ec2-107-22-7-9.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false }
  }
});



sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });


//Defining Model  
///////////////////////////////////
// var Project  = sequelize.define('Project', {
//   title: Sequelize.STRING(50),
//   description: Sequelize.TEXT
// });  

// sequelize.sync()
//   .then(function(){
//     PromiseRejectionEvent.create({
//       title: 'Project 1', 
//       description:  'First Project Description'
//     })
//     .then(function(project){
//         console.log("Project  Insert was  Successful"  + project.id  ) ;
//     })
//     .catch(function(error){
//       console.log("Something went wrong  inserting: "  +  error) ; 
//     }) ;  
//   }) ;  

///////////////////////////////////

var User =  sequelize.define('User',  {
firstname: Sequelize.STRING(30),
lastname: Sequelize.STRING(30),
title: Sequelize.STRING(50)
}) ;  

var Task  = sequelize.define('Task',{
  title: Sequelize.STRING  ,  
  description:  Sequelize.TEXT

});

//define a relashionship
User.hasMany(Task); 

sequelize.sync()
.then(function(){
  User.create({
    firstname: 'Bambi'  ,  
    lastname: 'B'  ,  
    title: 'Idiot'
  })
  .then(function(user){
    console.log("user Created : "  +  user.id);  

    Task.create({
      title: 'Task 1',
      description:  'Tasking one',
      UserId: user.id
    }).then(function(){console.log("Task 1 created ")})  ; 

    Task.create({
      title: 'Task 2',
      description:  'Tasking two',
      UserId: user.id
    }).then(function(){console.log("Task 2 created ")})  ;  
  }) ; 


  Task.findAll({}).then(function(data){
    data =  data.map(value =>  value.dataValues) ;

    console.log("All Records");  
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].title  + '  -  ' +  data[i].description  +   ' - '  +  data.UserId )  ; 
    };
  }); 
}); 




//////////////////////////////////////////////////////////////////////////////////////////////////////
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


app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(express.static("views"));
app.use(express.static("public"));

  // setup a 'route' to listen on the default url path 
  app.get("/", (req,res) => {
    res.render('Home',{layout:false}); 

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
app.post("/contact-form-process", UPLOAD.single("photo")),(req,res)=> {
  const FORM_DATA = req.body ; 
  const FORM_FILE = req.file ;  

  const DATA_RECEIVED =  " Your submissionm was received:<br>/br" + 
    "Your form  data was: <br/>"  + JSON.stringify(FORM_DATA)  + "<br/><br>" +  
    "Your file  data was: <br/>"  + JSON.stringify(FORM_FILE)  + 
    "<br/><br/>Welcome <strong>"  + FORM_DATA.fname + " " +  FORM_DATA.lname + "</strong>" + 
    "to the world of form processing."

    res.render('dashboard',{
      data: FORM_DATA.fname,
      layout:false});

    res.send(DATA_RECEIVED); 
}

var mailOptions =  {
  from: 'webb322assigment2@gmail.com',
  to: 'webb322assigment2@gmail.com',    
  subject: 'Welcome to StayAnywhere',
  html: '<p>Hello' + ":<p>Thank  you for staying with us</p>"

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
