import React, { useEffect, useState } from "react";
import { ChatState } from '../../Context/ChatProvider';
import { Box, IconButton, Text,Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../Config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from "axios";
import '../Chats/ChatCSS/styles.css'
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
// import {Lottie} from 'react-lottie'

const ENDPOINT = "http://localhost:5000"
var socket,selectedChatCompare
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
   const {user,selectedChat,setSelectedChat} =  ChatState()
   console.log(
     `selectedChat,setSelectedChat------`,
     selectedChat,
     selectedChat&&selectedChat.chatName
   );
  const toast=useToast()
  const [messages,setMessages]=useState([])
  const [loading,setLoading]=useState(false)
  const [newMessage, setNewMessage] = useState();
  const [socketConnected,setSocketConnected] =useState(false)
  const [typing,setTyping] = useState(false)
  const [isTyping,setIsTyping]=useState(false)

    useEffect(() => {
      // start the socket and it should be at the top
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => {
        setSocketConnected(true);
      });
      // connect to that room
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }, []);


  const sendMessage=async(event) => {
    // if it is an enter key and has anything in newMessage than call post Message api
    if(event.key==="Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization : `Bearer ${user.token}`
          }
        }
        setNewMessage("");
        const { data } = await axios.post(
          `/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log('Post Mesage--------',data)
        socket.emit('new message',data)
        setMessages([...messages,data])
      } catch (error) {
         toast({
           title: "Error Occured!",
           description: error.message,
           status: "error",
           duration: 5000,
           isClosable: true,
           position: "bottom",
         });
         
         return;
      }
    }
  }

  const fetchMessages= async () => {
    // if no chat is selected than return it.
    if(!selectedChat) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true)
      const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)
      console.log('Fetched Messages1----',data)
      setMessages(data)
      setLoading(false)
      // emitting the signal to join the room
      socket.emit('join chat',selectedChat._id)
      socket.emit()
    } catch (error) {
       toast({
         title: "Error Occured!",
         description:"Failed to load the messages",
         status: "error",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       setLoading(false);
       return;
    }
  }
  useEffect(() => {
    fetchMessages()
    // just keep the backup of the selected chat state and we can compare whether to emit the message or give the notification to user
    selectedChatCompare=selectedChat

  },[selectedChat])

  useEffect(() => {
    socket.on("message received",(newMessageRecieved)=>{
      // if none of the chat Selected or this chat that is selected doesnot match selected chat
      if(!selectedChatCompare || selectedChatCompare._id!== newMessageRecieved.chat._id) {
        // give notification
      }else{
        setMessages([...messages,newMessageRecieved])
      }
    }); 
  }) //no dependencies should be there coz, we want to update useEffect everytime ,our state updates
  const typingHandler=(e) => {
    setNewMessage(e.target.value)

    // Typing Indicator Logic here
    if(!socketConnected) return 

    if(!typing){
      setTyping(true)
      socket.emit('typing',selectedChat._id)
    }
    // the function when to stop typing ,if the user is not typing anymore

    let lastTypingTime=new Date().getTime()
    var timeLength=3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime
      
      if(timeDiff >= timeLength && typing){
        socket.emit('stop typing',selectedChat._id)
        setTyping(false)
      }
    }, timeLength);
  }
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users).toUpperCase()}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}/>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages Here */}
            {loading ? (
              <Spinner
                size="xl"
                width="20"
                height="20"
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {/* onKeyDown -> if we press enter than message will be sent */}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {
                isTyping?(<div>
                {/* <Lottie width={70}/> */}
                Typing...
                </div>) :(<></>)
              }
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a Message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontFamily="Work sans" paddingBottom="3" fontSize="28px">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat
