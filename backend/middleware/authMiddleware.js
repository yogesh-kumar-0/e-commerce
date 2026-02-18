const jwt =require('jsonwebtoken');
const User =require('../models/User');

// middleware to protect routes
const protect = async(req,res,next)=>{
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.user.id).select("-password"); //exclude password
            next();
        }
        catch(err){
            console.error('token verification failed');
            res.status(401).json({messege:"not authorized, token failed"})

        }
    }else{
        res.status(401).json({messege:'not authorized, no token provied'})
    }

};

const admin = (req,res,next)=>{
    if(req.user && req.user.role==='admin'){
        next();
    }else{
        res.status(403).json({messege:'not authorized as an admin'});
    }
}

module.exports ={protect,admin};