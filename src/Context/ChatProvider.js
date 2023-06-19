import {createContext, useContext, useState,useEffect} from 'react'
import { useHistory } from "react-router-dom";

const ChatContext = createContext()

// chatProvider which will wrap whole of our app
// children - whole of our app
const ChatProvider = ({children}) => {
    const [user,setUser] = useState()
    const [selectedChat,setSelectedChat] = useState() //loggedinUser and otherUser
    const [chats,setChats] = useState([]) //we can populate all of our current chats inside the chats state

    const history = useHistory();
    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      // if no userInfo redirect lo login page
      // console.log('history------',history.push('/'))
      if (!userInfo) {
        history.push('/')
      }
    }, [history]);
    return (
      <ChatContext.Provider
        value={{
          user,
          setUser,
          selectedChat,
          setSelectedChat,
          chats,
          setChats,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
}



export const ChatState = () => {
  return useContext(ChatContext); // inside it the whole of our state
}



export default ChatProvider

// now take this ChatProvider and go to index.js and wrap it
// so that whatever state created in our context api it can be accessible to whole of our app
// we need to use hook called useContext 