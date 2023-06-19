import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserList from '../UserList/UserList';
import UserBadgeItem from '../UserList/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChat,setGroupChat] = useState()
    const [selectedUsers,setSelectedUsers] = useState([])
    const [search,setSearch] =useState("")
    const [searchResult,setSearchResult] = useState([])
    const [loading,setLoading] = useState(false)
    const toast = useToast()
    // after creating groupchat we are going to append to the list of the chats [left side]
    const {user,chats,setChats} = ChatState()

    // to add users
    const handleSearch =async (query) => {
        setSearch(query)
        if(!query){
            return
        }

        try {
            setLoading(true)
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.get(
              `/api/user?search=${search}`,
              config
            );

            console.log("data--------", data);
            setSearchResult(data.response)
            setLoading(false)
        }
        catch(err) {
            toast({
              title: "Error fetching the chats",
              description: err.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
        }
    }

    const handleSubmit = async() => {
        if(!groupChat || !selectedUsers) {
             toast({
               title: "Please fill all the details",
               status: "warning",
               duration: 5000,
               isClosable: true,
               position: "top",
             });
             return
        }

        try{
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            `/api/chat/group`,
            {
              name: groupChat,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          // console.log("groupChatCreated----", data);
          setChats([data, ...chats]); // data,...chats to create very top of the chats
          onClose()
           toast({
             title: "New Group Chat Created",
             status: "success",
             duration: 5000,
             isClosable: true,
             position: "top",
           });
        }catch(err){
            // console.log('GroupChat error---',err.response.data)
              toast({
                title: "Error creating the group Chat",
                status: "error",
                description: err.response.data.message,
                duration: 5000,
                isClosable: true,
                position: "top",
              });
        }
    }

    const handleGroup= (userToAdd) => {
        // if user already added than show the warning
        if(selectedUsers.includes(userToAdd)){
             toast({
               title: "User Already Added, Please Select Another User",
               status: "warning",
               duration: 5000,
               isClosable: true,
               position: "top",
             });
             return 
        }
        else{
            setSelectedUsers([...selectedUsers,userToAdd]);
        }
 
    }
    const handleDelete= (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    }
  return (
    <>
      {/* button for New Group Chat */}
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            style={{
              fontSize: "35px",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* to add chat name */}
            <FormControl>
              <Input
                placeholder="Chat Name"
                // style={{ marginBottom: "10" }}
                mb={4}
                onChange={(e) => setGroupChat(e.target.value)}
              />
            </FormControl>
            {/* to add users */}
            <FormControl>
              <Input
                placeholder="Add Users"
                // style={{ marginBottom: "10" }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* selected users */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.length > 0 &&
                selectedUsers.map((val) => {
                  return (
                    <UserBadgeItem
                      key={val._id}
                      user={val}
                      handleFunction={() => handleDelete(val)}
                    />
                  );
                })
            }
            </Box>

            {/* render searched users */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult.length > 0 &&
              searchResult.slice(0, 4).map((user) => {
                return (
                  <UserList
                    user={user}
                    key={user._id}
                    handleFunction={() => handleGroup(user)}
                  />
                );
                //when i click on this it gonna add it to our setSelecedUsers
              }) 
              
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal
