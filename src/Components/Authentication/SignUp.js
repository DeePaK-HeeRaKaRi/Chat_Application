import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {useHistory} from 'react-router-dom'
const SignUp = () => {
    const [show,setShow]=useState(false)
    const [confirmShow,setConfirmShow]=useState(false)
    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [confirmPassword,setConfirmPassword]=useState()
    const [password,setPassword]=useState()
    const [pic,setPic]=useState()
    const [loading,setLoading]=useState(false)
    const history=useHistory()
    const handleClick=()=>{
        setShow(!show)
    }

    const handleConirmPassword=() => {
        setConfirmShow(!confirmShow);
    }
    const toast = useToast();
    const postDetails=(pics) => {
      setLoading(true)
      if(pics===undefined){
         toast({
           title: "Please select an image",
           status: "warning",
           duration: 5000,
           isClosable: true,
           position:'bottom'
         });
         return
      }

      if (pics.type === "image/jpeg" ||pics.type === "image/png" ||pics.type === "image/jpg") {
        const data = new FormData();
        data.append("file", pics);
        // chat-application should be given what we have given in cloudinary
        data.append("upload_preset", "chat-application");
        // check cloud name in cloudinary in dashboard
        data.append("cloud_name", "dg0bby62b");
        fetch("https://api.cloudinary.com/v1_1/dg0bby62b/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
            console.log("pics--", data.url);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        toast({
          title: "Please select an image !",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    }

    const submitHandler=async()=>{
      setLoading(true)
      // pic is optional as we have made one pic in  default in db
      if(!name || !email || !password || !confirmPassword){
        toast({
          title: "Please fill all the details!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      if(password !=confirmPassword){
         toast({
           title: "Passwords do not match",
           status: "error",
           duration: 5000,
           isClosable: true,
           position: "bottom",
         });
         return;
      }
      
      try{
        const config ={
          headers:{
            "Content-type":"application/json"
          }
        }
        console.log('picis-----',pic)
        const senddata={name:name,email:email,password:password,picture:pic}
        const {data}=await axios.post("/api/user",senddata,config)
        console.log('signupdata',data)
        toast({
          title: "Successfully signedup",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        
        localStorage.setItem('userInfo',JSON.stringify(data))
        setLoading(false);
        history.push('/chats')
      }catch(error){
        toast({
          title: "Error Occured!",
          description:error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={confirmShow ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleConirmPassword}>
              {confirmShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1.5}
          onChange={(e) => postDetails(e.target.files[0])}  //if user selects multiple imaes it will pick first image
        />
      </FormControl>

      <Button colorScheme="blue" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>Sign Up</Button>
    </VStack>
  );
}

export default SignUp
