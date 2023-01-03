const express=require('express')
const route = require("./route/route")
const app = express()

app.use(express.json());


app.use('/', route)
 

app.listen(3000, () => {
  console.log("Running on port 3000.")
})
