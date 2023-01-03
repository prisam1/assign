const express = require("express")
const router = express.Router()

const {create,login}= require("../controller/user")





router.post("/Create",create)
router.post("/login", login)


 

 
module.exports=router
