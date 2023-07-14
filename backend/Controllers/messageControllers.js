const asyncHandler=require('express-async-handler')
const Message = require('../models/messageModel')
const User = require('../Models/userModel')
const Chat = require('../Models/chatModel')
// Required ChatId on which chat we are supposed to send he message 
// 	actual message itself	
// 	sender of the message [will get with the help of the protect middleware]

const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId} = req.body

    if(!content || !chatId){
        // console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try{
        var message=await Message.create(newMessage)
        // we are populating the instance of mongoose
        message = await message.populate("sender","name picture")
        message = await message.populate("chat")
        // inside the chat we have each list of users, so we have to populate that also
        message=await User.populate(message,{
            path:"chat.users",
            select:"name picture email"
        })

        // update the lattestMessage as well
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        res.json(message)
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})
const allMessages=asyncHandler(async(req,res) => {
    try{
        const messages = await Message.find({ chat: req.params.chatId })
          .populate("sender", "name picture email")
          .populate("chat");
        // console.log('messages----------',messages)
        return res.json(messages)
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})
module.exports = { sendMessage, allMessages };