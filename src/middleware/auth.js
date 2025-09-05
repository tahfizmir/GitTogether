const authAdmin=(req,res,next)=>{
    const token='xyz';
    const isAuthenticated=token==='xyz';
    if(!isAuthenticated){
        res.status(401).send("unauthorised admin");
    }else{
        next();
    }
}
const authUser=(req,res,next)=>{
    const token='xyz';
    const isAuthenticated=token==='xyz';
    if(!isAuthenticated){
        res.status(401).send("unauthorised user");
    }else{
        next();
    }
}
module.exports={authAdmin,authUser};
