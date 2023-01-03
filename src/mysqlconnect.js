const mysql  = require('mysql')

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"pritamsam",
    
})  

db.connect((err)=>{ 
    if(!err){
        console.log("MySQL is connected")
    }else{
        console.log(err);
    }
}) 

module.exports={db}