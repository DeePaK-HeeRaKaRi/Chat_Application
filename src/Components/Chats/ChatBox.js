import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      width={{ base: "100%", md: "68%" }}
      flexDirection="column"
      padding="3"
      alignItems="center"
      bg="white"
      borderradius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox
