const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");

const generateToken = require("../Config/generateToken");
const Chat = require("../Models/chatModel");

// creating or fetching one to one chat
const accessChat=asyncHandler(async(req,res)=>{
    // current user who has logged in
    const {userId}=req.body
    // if chat with the above userId exists than return it else create it
    if(!userId){
        // console.log("UserId param not sent with request")
        return res.status(400)
    }
    var isChat = await Chat.find({
      isGroupChat: false, //if one to one chat than groupchat should be false
      //find both of the users -> currentUser LoggedIn and the userId that we are provided in
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } }, //current user who is logged in
        { users: { $elemMatch: { $eq: userId } } }, //and the userID that we are sent
      ],
    })
      // now populate users array
      .populate("users", "-password")
      .populate("latestMessage");

    //   populate the sender field as well from message model
        isChat = await User.populate(isChat, {
          path: "latestMessage.sender",
          select: "name picture email",
        });

        if(isChat.length>0){
            res.send(isChat[0])  //if chat exists
        }else{
            // create a new chat
            var chatData={
                chatName:"sender",
                isGroupChat:false,
                users:[req.user._id,userId]  //loggedin user and the user we are trying to create chat
            }

            try {
                const createdChat = await Chat.create(chatData);

                // now take the chat justnow created and send it to user
                const FullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password")
                res.status(200).send(FullChat)
            } catch (error) {
                res.status(400).json({message:error.message})
            }
        }
})

const fetchChats=asyncHandler(async(req,res)=>{
    try {
        // here we are fetching the chats from ChatModel based on id
        // and which user is logged in query the all the chats with that user
        // here inside the users array match this users id
        // chat{usres:[0:id,1:id]}
      const resp=await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users","-password")
          .populate("groupAdmin","-password")
          .populate("latestMessage")
          .sort({updatedAt : -1}) //sort from new to old means which sender has sent first
        //   res.status(200).send(resp);
          .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name picture email",
            });
            res.status(200).send(results)
          })
    } catch (error) {
        res.status(401).json({message:error.message})
    }
})
const createGroupChat=asyncHandler(async(req,resp)=>{
    // take a array of users from the body and take the name of the group chat
    if(!req.body.users || !req.body.name){
        return resp.status(400).send({message: 'Please fill all the details'})
    }
    // from frontend we are sending in stringify fromat
    // and in our backend we are going to parse
    var users =JSON.parse(req.body.users)
    if(users.length<2){
        return resp
          .status(400)
          .send({ message: "More than two users are required to form a group chat" });
    }

    // all of the users along with the logged in user will form a group
    users.push(req.user) 
    try{
        const groupChat = await Chat.create({
          chatName: req.body.name,
          isGroupChat: true,
          users: users,
          groupAdmin:req.user
        });

        // now we are going to chech this from database and send it

        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")

        resp.status(200).json(fullGroupChat)
    }catch(error){
        resp.status(401).json({ message: error.message });
    }
})

const renameGroup = asyncHandler(async(req,resp)=>{
    const {chatId,chatName} = req.body
    try{
         const updateChat = await Chat.findByIdAndUpdate(
            { _id: chatId },
            { chatName: chatName },
            {new : true}  //if i dont give this it will return the old chatname only
            )
            .populate('users','-password')
            .populate('groupAdmin','-password')
        resp.status(200).json(updateChat)
    }catch(error){
        resp.status(401).json({ message: error.message });
    }
})
const addToGroup= asyncHandler(async(req,resp)=>{
    const {chatId,userId} = req.body
    try{
        const added = await Chat.findByIdAndUpdate(
          { _id: chatId },
          { $push: { users: userId } },
          { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        resp.status(200).send(added)
    }catch(error){
        resp.status(401).json({ message: error.message });
    }
})
const removeFromGroup = asyncHandler(async (req, resp) => {
  const { chatId, userId } = req.body;
  try {
    const removed = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    resp.status(200).send(removed);
  } catch (error) {
    resp.status(401).json({ message: error.message });
  }
});
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};