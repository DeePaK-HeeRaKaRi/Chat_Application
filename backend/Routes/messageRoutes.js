const express=require('express')

const router=express.Router()
const { protect } = require("../Middlewares/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../Controllers/messageControllers");

router.post('/',protect,sendMessage) 

router.get('/:chatId',protect,allMessages)


module.exports = router
