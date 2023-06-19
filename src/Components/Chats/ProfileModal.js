import React from 'react'
import { useDisclosure} from '@chakra-ui/hooks'
import {IconButton} from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,Image,Text
} from "@chakra-ui/react";

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
       {children ? (
          <span onClick={onOpen}>{children}</span>
        ) : (
          <IconButton
            diplay={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
          />
        )}

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ base: "sm", md: "lg" }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent height='440px'>
            <ModalHeader
              fontSize="40px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
              textTransform="capitilize"
            >
              {user.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyCntent="space-between"
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.picture}
                alt={user.name}
              />
              <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                marginTop="30px"
              >
                Email: {user.email}
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
}

export default ProfileModal
