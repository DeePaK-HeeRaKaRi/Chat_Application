import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Tooltip,
  Avatar,
  MenuItem,
  MenuProvider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
} from "@chakra-ui/react";
import { BellIcon,ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from 'react'
import {ChatState} from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from 'axios'
import ChatLoading from '../../Components/Loading/ChatLoading'
import UserList from '../../Components/UserList/UserList'
import {Spinner} from '@chakra-ui/spinner'
function SideDrawer() {
  const [search,setSearch] = useState('')
  const [searchResult, setsearchResult] = useState([]);
  const [loading,setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(); //when we click on a paticular user it display the chat that we are loaded
  
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history=useHistory()
  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    history.push('/')
  }
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleSearch=async () => {
    if(!search){
      toast({
        title: "Please Enter Something in Search",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return 
    }
    try{
      setLoading(true)
      const config={
        headers : {
          Authorization : `Bearer ${user.token}`
        }
      }
      const searchResponse = await axios.get(`/api/user?search=${search}`,config)
      setsearchResult(searchResponse.data.response);
      setLoading(false)
    }catch(err){
      toast({
        title: "Error Occured",
        description: `${err.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const accessChat=async(userId) => {
    try{
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-tye":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // to create chat
      const createdChatResponse = await axios.post("/api/chat", { userId },config);
      console.log("createdChatResponse---", createdChatResponse);
      setSelectedChat(createdChatResponse.data); //sending to chatProvider
      if (!chats.find((c) => c._id === createdChatResponse.data._id)) setChats([createdChatResponse.data,...chats]); //if there than append the chats

      setLoadingChat(false);
      onClose()
    }catch(err){
      toast({
        title: "Error fetching the chat",
        description:err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            {/* in smaller screen dont show text in larger screen show tet */}
            <Text display={{ base: "none", md: "flex" }} padding="5px">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <h2 style={{ fontFamily: "Work sans", fontSize: "20px" }}>
          Chat Application
        </h2>

        <Menu>
          <MenuButton padding="1">
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          {/* <MenuList></MenuList> */}
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name} //it would give the first alphabet only
              src={user.picture}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuProvider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom="2">
              <Input
                placeholder="Search by name or email"
                marginRight="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.length > 0 &&
              searchResult?.map((user) => {
                return (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer
