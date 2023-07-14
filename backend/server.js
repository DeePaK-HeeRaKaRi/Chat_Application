const express=require("express")
const dotenv=require("dotenv")
const { chats } = require("./Data/data")
const connectDB = require("./Config/db")
// const userRoutes = require('./Routes/userRoutes')
const userRoutes=require("./Routes/userRoutes")
const chatRoutes=require("./Routes/chatRoutes")
const messageRoutes = require("./Routes/messageRoutes");
const {notFound,errorHandler}=require('./Middlewares/errorMiddleware')

// creating instance
const app=express()
dotenv.config()
app.use(express.json())  // to accept json data
connectDB()

app.get('/',(req,resp)=>{
    resp.send("API is running successfully")
})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
// if we will give wrong apis
app.use(notFound)

// if still the error exists this will execute
app.use(errorHandler)

const PORT = process.env.PORT || 6000
const server=app.listen(PORT,console.log(`Server Started on PORT ${PORT}`))

const io=require('socket.io')(server,{
    // the amount of time it will take while it been inactive ,lets say 60000ms, it will wait 60secs before it goes off
    // for 60secs the user didnot send any message it can close the connction to save the bandwidth
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})
// creating a connection
io.on("connection",(socket) => {
    console.log('Connected to socket.io')
    // every time user opens the app he should be connected to his own personal socket
    // creating new socket where the frontend will send somedata an dwill join a room [setup]
    socket.on('setup',(userData) =>{
        // creating a new room with id of userData and that room will exclusive for that particular user only
        socket.join(userData._id)
        console.log('socket.on---',userData._id)
        socket.emit('connected')
    })

    // join a chat
    // it will take room id from frontend
    // when we click on a particular chat it should create a new room with
    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log('User Joined room',room)
    })
    // create new socket for typing
    socket.on('typing',(room)=>{
        // inside of this room typing is going on
        socket.in(room).emit("typing")
    })

    socket.on("stop typing",(room) => socket.in(room).emit("stop typing"))
    
    socket.on('new message',(newMessageReceived) => {
        // which chat it belongs to
        var chat=newMessageReceived.chat
        // if the chat doesnot have any users
        if(!chat.users) {
            console.log('Chat.users not defined')
            return
        }

        // if we are a user sending messages inside of a group we want except for us, we want that message to be emitted to all of the users
        // 5 users in a group if iam sending a chat so it should be received to other 4 memebers ,not for me

        chat.users.forEach(user => {
          // if it is sent by us
          if (user._id === newMessageReceived.sender._id) {
            return;
          }
          // it will message received in frontend
          //   iam sender to this user user._id
          socket.in(user._id).emit("message received", newMessageReceived);
        })

    })
})