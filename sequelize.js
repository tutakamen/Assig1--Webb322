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
      console.log(data[i].title  + ' - ' +  data[i].description  +   ' - '  +  data.UserId )  ; 
    };
  }); 
}); 

//////////////////////////////////////////////////////////////////////////////////////////////////////
