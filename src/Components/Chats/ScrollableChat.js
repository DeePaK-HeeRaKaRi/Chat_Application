import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../Config/ChatLogics";
import {ChatState} from '../../Context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {
  console.log('messages-----',messages)
  const {user}=ChatState()
  return (<ScrollableFeed>
    {
          messages && messages.map((m,i) => {
           return (
             <div style={{ display: "flex" }} key={m._id}>
               {(isSameSender(messages, m, i, user._id) ||
                 isLastMessage(messages, i, user._id)) && (
                 <Tooltip
                   label={m.sender.name}
                   placement="bottom-start"
                   hasArrow
                 >
                   <Avatar
                     mt="7px"
                     mr={1}
                     size="sm"
                     cursor="pointer"
                     name={m.sender.name}
                     src={m.sender.picture}
                   />
                 </Tooltip>
               )}
               <span
                 style={{
                   backgroundColor: `${
                     m.sender._id === user._id ? "#33FF58" : "#B5C2B7"
                   }`,
                   color:'black',
                   borderRadius: "20px",
                   padding: "5px 15px",
                   maxWidth: "75%",
                   marginLeft: isSameSenderMargin(messages,m,i,user._id),
                   marginTop:isSameUser(messages,m,i,user._id) ? 3:10
                 }}
               >
                 {m.content}
               </span>
             </div>
           );
        })
    }
  </ScrollableFeed>);
};

export default ScrollableChat
