require('dotenv').config() ; 


module.exports =  {
    // const connStr = "mongodb://localhost/web322e"  , 
    // dbconn : "mongodb+srv://mustafa:Winter22@cluster0.yhegy.mongodb.net/web322e?retryWrites=true&w=majority" ,
    userName  : "mbukhari3",
    dbconn: process.env.dbconn , 
    GmailPassword : process.env.GmailPassword , 
    adminPass: "Winter22"
    
}

