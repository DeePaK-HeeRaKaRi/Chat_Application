const jwt=require('jsonwebtoken')
const User=require('../Models/userModel')
const asyncHandler=require('express-async-handler')

const protect = asyncHandler(async(req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(" ")[1] //remove bearer
            if (!token) {
              return res.status(401).json({ response: "Not authorized,no token" });
            }
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            // console.log('decoded---',decoded)
            req.user=await User.findById(decoded.id).select('-password') //dont include password
            next()
        }catch(err){
            res.status(401).json({response:"Not authorized,token failed"})
        }
    }else{
        res.status(401).json({ response: "You are not authorized, please logIn to continue" });
    }
})

module.exports={protect}