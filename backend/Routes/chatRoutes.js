const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../Controllers/chatController");
const { protect } = require("../Middlewares/authMiddleware");

const router=express.Router()

// only loggedin user will have access
router.post('/',protect,accessChat)
router.get('/',protect,fetchChats)

router.post('/group',protect,createGroupChat)

router.put('/rename',protect,renameGroup)

router.put('/groupadd',protect,addToGroup)
// if admin wants to remove a user from group
router.put('/groupremove',protect,removeFromGroup)



module.exports = router;