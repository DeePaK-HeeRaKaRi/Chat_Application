import React,{useState,useEffect} from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { useToast, Avatar } from "@chakra-ui/react";
import { Box, Text, Stack } from "@chakra-ui/layout";
import { Button } from '@chakra-ui/button'
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios'
import ChatLoading from '../../Components/Loading/ChatLoading'
import { getSender,getPicture } from "../../../src/Config/ChatLogics";
import GroupChatModal from './GroupChatModal';
// when we are come to this page we will fetch the all chats of the loggedin user
const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // to create chat
      const fetchData = await axios.get("/api/chat", config);
      console.log("fetchData---", fetchData.data);
      setChats(fetchData.data);
    } catch (err) {
      toast({
        title: "Error fetching the chats",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]); // if any user is left from the group it should fetch the chats again

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }} //if chat is selected than selected chat user will be displyed and in medium display both of them
      flexDir="column"
      alignItems="center"
      padding="3"
      background="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        paddingBottom="3"
        paddingHorizontal="3"
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        MyChats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        padding="3"
        background="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats.length > 0 ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display="flex"
                >
                  <Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    name={
                      !chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName
                    }
                    src={getPicture(loggedUser, chat.users)}
                  />
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : chats.length === 0 ? (
          "No chats Availble"
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats
