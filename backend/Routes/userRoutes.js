const express=require('express')
const {
  registerUser,
  authUser,
  allUsers,
} = require("../Controllers/userControllers");
const router=express.Router()
const {protect} =require('../Middlewares/authMiddleware')
router.route('/').post(registerUser)
router.post('/login',authUser)

// router.route('/').get(protect,allUsers)
router.get('/',protect,allUsers)
module.exports=router