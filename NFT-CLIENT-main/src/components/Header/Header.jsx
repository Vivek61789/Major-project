"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Box,
  Flex,
  Avatar,
  // Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  // useColorMode,
  Center,
  Text,
} from "@chakra-ui/react";
import { useContextAPI } from "../context/DataContext";

// wagmi imports
import { useAccount, useAccountEffect, useSignMessage } from "wagmi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../utils/config.json";
import { useToast } from "@chakra-ui/react";

export default function Nav() {
  const toast = useToast();
  // context
  const { auth, setJwtStatus, setOrgStatus } = useContextAPI();
  // const { address } = useAccount();

  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = React.useState();

  //wagmi hook for signing Message
  const { signMessageAsync } = useSignMessage({
    message,
  });

  const navigate = useNavigate();

  const organizer_status = localStorage.getItem("organizer_status");
  const { address } = useAccount();
  useAccountEffect({
    onConnect(data) {
      const jwt = localStorage.getItem("jwtToken");
      if (jwt) {
        setJwtStatus(true);
      }
      if (!jwt) {
        console.log("hello jwt");
        const FetchJWT = async () => {
          try {
            //creating nonce
            const nonceAPI = config.nonce_api;
            const nonce = await axios.post(nonceAPI, {
              address: data.address,
            });

            //sending the nonce to sign and take signature that signed with user personal token...
            const signature = await signMessageAsync({
              message: `I am signing my one-time nonce: ${nonce.data.message}`,
            });

            // fetching JWT by sending signature
            const authenticateURL = config.authenticate_api;
            const authenticateResponse = await axios.post(authenticateURL, {
              address: data.address,
              signature: signature,
            });

            //checking the user is registered or not
            //
            const organizer_status = await axios.post(config.reroute_api, {
              token: authenticateResponse.data.token,
            });
            // setting jwt
            localStorage.setItem("jwtToken", authenticateResponse.data.token);

            // setting organizer_status
            localStorage.setItem(
              "organizer_status",
              organizer_status.data.result
            );

            if (organizer_status.data.result === "register") {
              setOrgStatus("register");
            } else {
              setOrgStatus("registered");
              toast({
                title: "Successful",
                description: "Welcome back Organizer🤩...",
                status: "success",
                duration: 5000,
                isClosable: true,
              });

              // asking the organizer for their choice

            //   let text =
            //     "Please click on OK to navigate to Dashboard or cancel";
            //   if (confirm(text) == true) {
            //     text = "You pressed OK!";
            //     navigate("/organizer-dashboard");
            //   } else {
            //     text = "You canceled!";
            //     navigate("/");
            //   }
            }

            //setting jwt status for register screen to render.
            setJwtStatus(true);
          } catch (e) {
            //errors-block
            console.log(e);
          }
        };
        FetchJWT();
      }
    },
    onDisconnect() {
      navigate("/");
      console.log("Disconnected!");
      // clearing local-storage
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("organizer_status");
      setJwtStatus(false);
      setOrgStatus("");
    },
  });

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box background={"purple.300"} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Text
          fontSize={"3xl"}
          style={{
            cursor: "pointer",
            color: "white",
            fontWeight: "600",
          }}
          onClick={() => handleNavigate("/")}
        >
          Event Ticketing
        </Text>

        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            {auth && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>Username</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}

            <Box
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              {organizer_status === "registered" && address && (
                <Button
                  bg={"red.400"}
                  color="white"
                  _hover={{ bg: "black", color: "white" }}
                  onClick={() => handleNavigate("/organizer-dashboard")}
                >
                  Dashboard
                </Button>
              )}
              
              <ConnectButton />
            </Box>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
