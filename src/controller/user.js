

const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {db}=require("../mysqlconnect")
const validator=require("../valid/valid")



const create=(req,res)=>{
    if(req.body.name){
        if(!validator.isValidUserName(req.body.name)){
            return res.status(400).send({status:false,message:"Please provide valid name."})
        }
    }else{
        return res.status(400).send({status:false,message:"Please provide name."})
    }

    if(req.body.email){
        if(!validator.isValidEmail(req.body.email)){
            return res.status(400).send({status:false,message:"Please provide valid email."})
        }   
    }else{
        return res.status(400).send({status:false,message:"Please provide email."})
    }

    if(req.body.password){
        if(!validator.isValidPassword(req.body.password)){
            return res.status(400).send({status:false,message:"Please provide valid Password."})
        }
        req.body.password=bcrypt.hash(req.body.password,10);
    }else{
        return res.status(400).send({status:false,message:"Please provide valid Password."})
    }

    let query=`INSERT INTO users (name, email, password) VALUES (?, ?, ?);`;
    db.query(query,[req.body.name ,req.body.email ,req.body.password],(error,result)=>{
        if(error){
            if(error.code=='ER_DUP_ENTRY'){
                return res.status(400).send({status:false,message:"Email alredy present.",data:result})
            }
        }else{
            return res.status(201).send({status:true,message:"Created successfully",data:result})
        }
    })

}

const login=(req,res)=>{
    if(req.body.email){
        if(!validator.isValidEmail(req.body.email)){
            return res.status(400).send({status:false,message:"Please provide valid email."})
        }   
    }else{
        return res.status(400).send({status:false,message:"Please provide email in the request body."})
    }

    if(req.body.password){
        if(!validator.isValidPassword(req.body.password)){
            return res.status(400).send({status:false,message:"Please provide valid Password in string with no spaces and Min 8 Charecters and Max 20 charecters."})
        }
    }else{
        return res.status(400).send({status:false,message:"Please provide valid Password in the request body."})
    }

    let query=`SELECT * FROM users WHERE email = (? );`;

    db.query(query,req.body.email,(error,result,field)=>{
        if(error)
        {
            console.log(error)
        }
        else
        {
            let correct=bcrypt.compare(req.body.password,result[0].password)
            if(!correct)
            {
                let count=+1
                 let remaning=5-count
                 if(count==5 && remaning>=0)
                 {
                    return res.status(401).send({status:false,message:"Your account is bloked for 24 hours"})
                 
                 }
                return res.status(401).send({status:false,data:remaning,message:" Password is wrong"})
                 

            }
            
            else{

                let token = jwt.sign({
                    userId: user._id.toString()
                },
                    "pritamsam", { expiresIn: "1hr" }
                );
            
                res.header("token", token);
                return res.status(200).send({ status: true, message: "User Login Successfully", data: token })
            
            }
        }
    })
    
   



}


module.exports={create,login}
