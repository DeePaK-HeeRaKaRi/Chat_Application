export const getSender = (loggedUser,users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}
export const getPicture =(loggedUser,users) => {
    return users[0]._id === loggedUser._id ? users[1].picture : users[0].picture
}
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// for rendering messages
// messages,currentMessage,currentIndex,loggedInUserId
export const isSameSender = (messages, m,i,userId) => {

  return (
    i<messages.length-1 && 
    
      //if the next message is not equal to the current sender
      (messages[i+1].sender._id !== m.sender._id || messages[i+1].sender._id ===undefined) && 
      //if the current message is not equal to the loggedin user i.e., it is equal to the other user
      // in the loggedin user we are not going to display the profile picture
      (messages[i].sender._id !== userId)
    
  )
}

export const isLastMessage = (messages,i,userId) => {
  return(
    // last messgae of opposite user
    i===messages.length-1 && 
    // the id of the last message is not equal to the loggedin Users Id
    messages[messages.length-1].sender._id !== userId 
    //  that message actually exists
    && messages[messages.length-1].sender._id
  )
}

export const isSameSenderMargin = (messages,m,i,userId)=>{
  if(
    i<messages.length - 1 && messages[i+1].sender._id ===m.sender._id && messages[i].sender._id !== userId
  ){
    return 33;
  }
  
  else if(
    (i<messages.length - 1 && messages[i+1].sender._id!==m.sender._id && messages[i].sender._id !== userId) || (i=== messages.length-1 && messages[i].sender._id !== userId)
  ){
    return 0
  }
  else{
    return "auto"
  }
}

export const isSameUser = (messages,m,i)=>{
  return i>0 && messages[i-1].sender._id === m.sender._id
}