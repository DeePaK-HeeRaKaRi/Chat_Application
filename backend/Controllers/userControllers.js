const asyncHandler=require('express-async-handler')
const User = require('../Models/userModel')
const generateToken=require('../Config/generateToken')
const registerUser = asyncHandler(async(req,res)=>{
    const { name, email, password, picture } = req.body;

    if(!name || !email || !password){
        res.status(400).json({ message: "Please Enter all Fields" });
    }

    const userExists= await User.findOne({email:email})
    if(userExists){
        res.status(400).json({ message: "User Already Exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      picture,
    });
    if(user){
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          token: generateToken(user._id),
        });
    }else{
        res.status(400).json({ message: "Failed to create new user" });
    }
})
const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body

    if(!email || !password) {
        res.status(404).json({ message: "Please Enter all Fields" });
    }

    const user=await User.findOne({email: email})
    if(!user){
        res.status(401).json({messgae:'No user found'})
    }
    if(user && (await user.matchPassword(password))){
            res.status(201).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              picture: user.picture,
              token: generateToken(user._id),
            });
    }else{
        //  res.status(400);
        //  throw new Error("Invalid Email or Password");
        res.status(401).json({message: "Invalid Email or Password"});
    }
})

// /api/user?search=deepak
const allUsers=asyncHandler(async(req,res)=>{
  const keyword = req.query.search
    ? {
        // or condition , if matxhes anyone of the field
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // console.log("keyword", keyword);
  // [ { name: [Object] }, { email: [Object] } ]
  // should not search the logged in user {_id:{$ne :req.user._id} $ne notequal
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password')
 
  // if(users.length>0){
  //   res.status(200).json({ response: users });
  // }else{
  //   res.status(200).json({response:'No users found'})
  // }
  res.status(200).json({ response: users });
  
})
module.exports = { registerUser, authUser, allUsers };