import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import CreateEvent from "./CreateEvent";
import axios from "axios";
import api_json from "../../utils/config.json";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import event_contract_abi from "../../contracts/event_abi.json";
import HARMONYANDBEATS from "../../assets/1.png";
import WORLDMUSICWAVE from "../../assets/2.png";
import SNAPSHOTSTORIES from "../../assets/3.png";
import LENSLUMINARIES from "../../assets/4.png";
import COLORSOFTHEWORLD from "../../assets/5.png";
import ARITISTICODYSSEY from "../../assets/6.png";
import ARITISTICAMALGAM from "../../assets/7.png";
import MEDIAMOSAIC from "../../assets/8.png";
import FUTURISTICFANTASIES from "../../assets/9.png";
import DIGITALDREAMS from "../../assets/10.png";
import web3 from "../../configurations/alchemy/alchemyConfiguration";
import { config } from "../../configurations/wagmi/Rainbowkit";
import json_config from "../../utils/config.json";
import { Spin } from "antd";
import "./Organizer.css";
//
const getImage = (name) => {
  const singleWord = name.replace(/\s+/g, "").toUpperCase();
  if (singleWord === "HARMONYANDBEATS") {
    return HARMONYANDBEATS;
  } else if (singleWord === "WORLDMUSICWAVE") {
    return WORLDMUSICWAVE;
  } else if (singleWord === "SNAPSHOTSTORIES") {
    return SNAPSHOTSTORIES;
  } else if (singleWord === "LENSLUMINARIES") {
    return LENSLUMINARIES;
  } else if (singleWord === "COLORSOFTHEWORLD") {
    return COLORSOFTHEWORLD;
  } else if (singleWord === "ARITISTICODYSSEY") {
    return ARITISTICODYSSEY;
  } else if (singleWord === "ARITISTICAMALGAM") {
    return ARITISTICAMALGAM;
  } else if (singleWord === "MEDIAMOSAIC") {
    return MEDIAMOSAIC;
  } else if (singleWord === "FUTURISTICFANTASIES") {
    return FUTURISTICFANTASIES;
  } else if (singleWord === "DIGITALDREAMS") {
    return DIGITALDREAMS;
  } else {
    return WORLDMUSICWAVE;
  }
};

const Organizer = () => {
  return (
    <Box
      style={{
        backgroundColor: "rgb(6 6 6)",
       
      }}
    >
      <Container
        // paddingTop={5}
        // paddingBottom={10}
        maxW={"8xl"}
        // display={"flex"}
        // justifyContent={"center"}
        // alignItems={"center"}
      >
        <Tabs
          sx={{
            pt: "5",
          }}
          // isFitted
          variant="enclosed"
        >
          <TabList
            sx={{
              borderBottom: "1px solid grey",
            }}
            mb="1em"
          >
            <Tab>Created Events</Tab>
            <Tab>Create Event</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DisplayEvents />
            </TabPanel>
            <TabPanel>
              <CreateEvent />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default Organizer;

const DisplayEvents = () => {
  // drawer state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { address } = useAccount();
  const [orgEvents, setOrgEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(api_json?.getEventsByOrganizer, {
          address: address,
          //   address:"0x22c688A8bc69d40ffeB2BB90e534f0b91DEeFdb2"
        });
        console.log(response);
        setOrgEvents(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [address]);
  const [eventData, setEventData] = useState(null);
  const [submitEventLoad, setSubmitEventLoad] = useState(false);
  const [withdrawLoad, setwithdrawLoad] = useState(false);
  const editEventDetails = async (item) => {
    console.log(item);

    setEventData(item);
    // drawer state
    onOpen();
  };
  console.log(eventData);

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const submitEditEvent = async () => {
    // load
    setSubmitEventLoad(true);
    setSpinning(true);
    console.log(eventData);
    // converting to timestamp
    const d = eventData?.date;
    const convertedDate = new Date(d).getTime() / 1000;
    // console.log("converted", convertedDate);

    editEventTransaction.writeContract({
      abi: event_contract_abi,
      address: eventData?.contract_address,
      functionName: "setEventDetails",
      args: [
        eventData?.eventName,
        eventData?.eventSymbol,
        convertedDate,
        eventData?.ticketSupply,
        web3.utils.toWei(eventData?.price),
      ],
    });
  };

  // spinner
  const [spinning, setSpinning] = React.useState(false);
  const withdrawAmount = async () => {
    setwithdrawLoad(true);
    setSpinning(true);

    withDrawTransaction.writeContract({
      abi: event_contract_abi,
      address: eventData?.contract_address,
      functionName: "withdrawMoney",
    });
  };

  // edit event transaction
  //   transaction setup...
  const editEventTransaction = useWriteContract({
    config: config,
    mutation: {
      onError(error, variables) {
        console.log("error onError", error);
        console.log("error onError:variables", variables);
        setSubmitEventLoad(false);
        setSpinning(false);
        toast({
          title: `Error`,
          status: "error",
          // duration: 4000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      },
      onSuccess(data, variables) {
        console.log("onSuccess:data", data);
        console.log("onSuccess:variables", variables);
      },
      onSettled(data, error) {
        console.log("onSettled:data", data);
        console.log("onSettled:variables", error);
        if (error) {
          const errorStringify = JSON.stringify(error);
          const errorParse = JSON.parse(errorStringify);
          console.log(" error from settlement", errorParse);
          toast({
            title: `Error: ${errorParse.details}`,
            status: "error",
            // duration: 4000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
          setSubmitEventLoad(false);
          setSpinning(false);
        } else {
          toast({
            title: "Verifying Tx",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          console.log("transaction hash", data);
          //closing confirm dialog
          // transaction status
          transactionReceipt(data);
        }
      },
    },
  });

  // withdraw transaction...
  const withDrawTransaction = useWriteContract({
    config: config,
    mutation: {
      onError(error, variables) {
        console.log("error onError", error);
        console.log("error onError:variables", variables);
        setwithdrawLoad(false);
        setSpinning(false);
        toast({
          title: `Error`,
          status: "error",
          // duration: 4000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      },
      onSuccess(data, variables) {
        console.log("onSuccess:data", data);
        console.log("onSuccess:variables", variables);
      },
      onSettled(data, error) {
        console.log("onSettled:data", data);
        console.log("onSettled:variables", error);
        if (error) {
          const errorStringify = JSON.stringify(error);
          const errorParse = JSON.parse(errorStringify);
          console.log(" error from settlement", errorParse);
          toast({
            title: `Error: ${errorParse.details}`,
            status: "error",
            // duration: 4000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
          setwithdrawLoad(false);
          setSpinning(false);
        } else {
          toast({
            title: "Verifying Tx",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          console.log("transaction hash", data);
          //closing confirm dialog
          // transaction status
          transactionReceipt(data);
        }
      },
    },
  });

  const transactionReceipt = async (txHash) => {
    console.log("tx-hash-transactionReceipt: ", txHash);
    try {
      //checking for recipe using alchemy
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (receipt) {
        console.log("transaction receipt", receipt);
        if (receipt.status) {
          console.log("transactionRecipet Transaction was successful!");
          setSubmitEventLoad(false);
          setSpinning(false);
          toast({
            title: `Transaction Successful`,
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });

          try {
            // converting to timestamp
            const d = eventData?.date;
            const convertedDate = new Date(d).getTime() / 1000;
            const response = await axios.put(
              json_config.updateEventByOrganizer,
              {
                id: eventData?._id,
                eventName: eventData?.eventName,
                eventSymbol: eventData?.eventSymbol,
                date: convertedDate,
                price: eventData?.price,
                ticketSupply: eventData?.ticketSupply,
                // event_count: 1,
                // contract_address: d[d.length - 1],
              }
            );
            console.log("response", response);
            // closing the drawer.....
            onClose();
          } catch (error) {
            console.log(error);
            setSpinning(false);
            setSubmitEventLoad(false);
          }

          return false;
        }
      } else {
        console.log(
          "Transaction receipt not found. The transaction may not be mined yet."
        );
        // calling again if there is no recipet
        transactionReceipt(txHash);
      }
    } catch (error) {
      setSpinning(false);
      setSubmitEventLoad(false);
      console.error(
        "Error occurred while checking transaction receipt:",
        error.message
      );
      toast({
        title: `Error-Failed:${error.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
        variant: "solid",
      });
    }
  };
  return (
    <Layout>
      <Container
        paddingTop={5}
        paddingBottom={10}
        maxW={"8xl"}
        display={"flex"}
        justifyContent={"center"}
        // alignItems={"center"}
        height={'90vh'}
      >
        <SimpleGrid
          columns={{
            base: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3,
            "2xl": 4,
          }}
          spacing={8}
        >
          {orgEvents.length > 0 &&
            orgEvents.map((item) => {
              return (
                <Box key={item + 1} onClick={() => editEventDetails(item)}>
                  <EachEvent data={item} />
                </Box>
              );
            })}
          {orgEvents.length == 0 && "No Events Created."}
        </SimpleGrid>
      </Container>

      <Drawer isOpen={isOpen} size={"lg"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton onClick={onClose} />
          <DrawerHeader>{`Edit Event Details`}</DrawerHeader>
          <DrawerBody>
            <Stack spacing="10px">
              <Box>
                <FormLabel htmlFor="eventName">Event Name</FormLabel>
                <Input
                  id="eventName"
                  placeholder="Please enter Event Name"
                  value={eventData?.eventName}
                  name="eventName"
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="eventSymbol">Event Symbol</FormLabel>
                <Input
                  id="eventSymbol"
                  placeholder="Please enter Event Name"
                  value={eventData?.eventSymbol}
                  name="eventSymbol"
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="date">Event Date</FormLabel>
                <Input
                  id="date"
                  placeholder="Please enter Event Name"
                  value={eventData?.date}
                  name="date"
                  onChange={handleChange}
                  type="datetime-local"
                />
              </Box>
              <Box>
                <FormLabel htmlFor="eventName">Ticket Price</FormLabel>
                <Input
                  id="price"
                  placeholder="Please enter Event Name"
                  value={eventData?.price}
                  name="price"
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="ticketSupply">Ticket Supply</FormLabel>
                <Input
                  id="ticketSupply"
                  placeholder="Please enter Event Name"
                  value={eventData?.ticketSupply}
                  name="ticketSupply"
                  onChange={handleChange}
                />
              </Box>
              <Stack direction={"row"}>
                <Button
                  colorScheme="red"
                  onClick={onClose}
                  isDisabled={submitEventLoad}
                >
                  cancel
                </Button>
                <Button
                  colorScheme="green"
                  onClick={submitEditEvent}
                  isDisabled={submitEventLoad}
                >
                  {submitEventLoad ? "Editing data...." : "Submit"}
                </Button>
              </Stack>
            </Stack>

            <Divider pt={10} />
            <DrawerHeader>{`Withdraw Event MATIC`}</DrawerHeader>
            <Button
              colorScheme="purple"
              onClick={withdrawAmount}
              isDisabled={withdrawLoad}
            >
              {withdrawLoad ? "Withdrawing..." : "Withdraw"}
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {spinning && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor="rgba(0, 0, 0, 0.5)" // Semi-transparent black background
          zIndex="9999" // High z-index to ensure it covers everything
        >
          <Flex
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            Loading...
          </Flex>
        </Box>
      )}
    </Layout>
  );
};

const EachEvent = ({ data }) => {
  /**
   * Converting timestamp to Date and Time String
   * @param {String} timestamp
   * @returns date
   */
  const dateConverter = (timestamp) => {
    const modifiedTimestamp = timestamp.substring(0, 10);
    const date = new Date(modifiedTimestamp * 1000);
    return date.toDateString();
    // return date.toDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Box>
      <Card maxW="sm" className="listing_card">
        <CardBody>
          <Image
            className="listing_card__image"
            src={getImage(data?.eventName)}
            alt="Green double couch with wooden legs"
            borderRadius="lg"
            border={"1px solid #2d2d2d"}
          />
          <Stack mt="5" spacing="3" className="listing_card__content">
            <Stack direction={"row"} justify={"space-between"}>
              <Heading size="md" fontSize={"16px"} color={"black"}>
                {data?.eventName}
              </Heading>
              <Heading size="md" fontSize={"16px"} color={"black"}>
                {data?.eventSymbol}
              </Heading>
            </Stack>
            <Divider
              style={{
                backgroundColor: "lightgrey",
              }}
            />
            <Stack direction={"row"} justify={"space-between"}>
              <Text color="grey" fontSize="md">
                Date
              </Text>
              <Text color="grey" fontSize="md">
                {dateConverter(data?.date)}
              </Text>
            </Stack>

            <Stack direction={"row"} justify={"space-between"}>
              <Text color="grey" fontSize="md">
                Ticket Supply
              </Text>
              <Text color="grey" fontSize="md">
                {/* {String(available_tickets.data)} */}
                {data?.ticketSupply}
              </Text>
            </Stack>
            <Stack direction={"row"} justify={"space-between"}>
              <Text color="grey">Ticket Price</Text>
              <Text color="grey">{data?.price} MATIC</Text>
            </Stack>
            <Stack direction={"row"} justify={"space-between"}>
              <Text color="grey" fontSize="md">
                Venue
              </Text>
              <Text color="grey" fontSize="md">
                London, UK
              </Text>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};
