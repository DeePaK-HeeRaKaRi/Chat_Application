import React from 'react'
import { Box, Avatar,Text } from "@chakra-ui/react";
const UserList = ({ user, handleFunction }) => {
  return( <Box onClick={handleFunction} _hover={{background: "#38B2AC" , color :"white"}}
   cursor='pointer' background='#E8E8E8' width='100%' display="flex" alignItems="center" color="black" px={3} py={2} mb={2} borderRadius="lg">
    <Avatar mr={2} size="sm" cursor="pointer" name={user.name} src={user.picture}/>
    <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
            <b>Email:</b> {user.email}
        </Text>
    </Box>
  </Box>
  );
};
export default UserList;