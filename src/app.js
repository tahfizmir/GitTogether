const express = require('express'); 
const app = express();
app.listen(3000,()=>{
    console.log("server is listening at 3000");
})
app.use("",(req,res)=>{
    
    res.send(`${req} is the response`);
})