const validator = require('validator');
const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Enter both first name and last name");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Not a valid email");
    }
    else if(!validator.isStrongPassword(password)){
         throw new Error("Weak password");
    }

}
module.exports=validateSignUpData;