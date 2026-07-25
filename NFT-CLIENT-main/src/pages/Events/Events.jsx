/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useReadContract } from "wagmi";
import factory_contract_abi from "../../contracts/factoryContract_ABI.json";
import event_contract_abi from "../../contracts/event_abi.json";
import json_config from "../../utils/config.json";
import Layout from "../../components/layout/Layout";
import "./Event.css";

import {
  Box,
  Card,
  CardBody,
  Container,
  Divider,
  Heading,
  Image,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import web3 from "../../configurations/alchemy/alchemyConfiguration";
import { NavLink } from "react-router-dom";
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
//
const getImage = (name) => {
  console.log("****", name);
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

const Events = () => {
  const events_count = useReadContract({
    abi: factory_contract_abi,
    address: json_config.factory_contract,
    functionName: "events_Count",
  });
  const created_events = useReadContract({
    abi: factory_contract_abi,
    address: json_config.factory_contract,
    functionName: "getCFDeployedArray",
  });

  const el = String(events_count.data);
  const events_to_number = +el;

  // creating array
  const events = Array.from({ length: events_to_number }, (v, i) => i);

  const [eventContract, setEventContract] = useState(false);
  function isTimePassed(timestamp) {
    console.log("timestamp", timestamp);
    const now = new Date();
    const targetTime = new Date(+timestamp * 1000);
    const diffInMilliseconds = targetTime - now;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    console.log("diffInHours", diffInHours);
    return diffInHours < -24 ? true : false;
  }

  return (
   <Layout>
     <Box height={'90vh'}>
      <Text textAlign={"center"} padding={5} fontSize={"xx-large"}>
        Events
      </Text>
      <Divider
        style={{
          backgroundColor: "#333030",
        }}
      />
      <Container
        paddingTop={5}
        paddingBottom={10}
        maxW={"8xl"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
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
          {events_count.isLoading
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((el) => {
                return (
                  <Box
                    width={"300px"}
                    height={"300px"}
                    key={el}
                    padding="6"
                    border={"1px solid #333030"}
                    borderRadius={"10px"}
                  >
                    <SkeletonCircle size="10" />
                    <SkeletonText
                      mt="4"
                      noOfLines={8}
                      spacing="4"
                      skeletonHeight="2"
                    />
                  </Box>
                );
              })
            : events_count.isSuccess &&
              events_to_number > 0 &&
              events.map((item, index) => {
                return (
                  <EachEvent
                    key={item + 1}
                    count={item}
                    contract={created_events.data[item]}
                    index={index}
                    setEventContract={setEventContract}
                  />
                );
              })}
        </SimpleGrid>
      </Container>
    </Box>
   </Layout>
  );
};

export default Events;

const EachEvent = ({ count, contract, index, setEventContract }) => {
  console.log(contract);

  const [currentTimeChip, setCurrentTimeChip] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeChip(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // fetch available to tickets
  const available_tickets = useReadContract({
    abi: event_contract_abi,
    address: contract,
    functionName: "availableTickets",
  });

  const eventName = useReadContract({
    abi: event_contract_abi,
    address: contract,
    functionName: "eventName",
  });

  const eventSymbol = useReadContract({
    abi: event_contract_abi,
    address: contract,
    functionName: "eventSymbol",
  });
  const initialTicketPrice = useReadContract({
    abi: event_contract_abi,
    address: contract,
    functionName: "initialTicketPrice",
  });

  const organizer = useReadContract({
    abi: event_contract_abi,
    address: contract,
    functionName: "organizer",
  });
  const eventStartDate = useReadContract({
    abi: event_contract_abi,
    address: contract,
    functionName: "eventStartDate",
  });
  const ticketSupply = useReadContract({
    abi: event_contract_abi,
    address: contract,
    functionName: "ticketSupply",
  });

  /**
   * Converting timestamp to Date and Time String
   * @param {String} timestamp
   * @returns date
   */
  const dateConverter = (timestamp) => {
    console.log("dat", timestamp);

    const modifiedTimestamp = timestamp.substring(0, 10);
    const date = new Date(modifiedTimestamp * 1000);
    return date.toDateString();
    // return date.toDateString() + " " + date.toLocaleTimeString();
  };

  /**
   * Converting timestamp to the number of days till the event
   * @param {String} timestamp
   * @returns Chip
   */
  const daysToGo = (timestamp) => {
    // console.log(timestamp * 1000);
    const targetTimeObj = new Date(timestamp * 1000);

    const timeDifference = targetTimeObj - currentTimeChip;
    const hours = Math.floor(timeDifference / 3600000);
    console.log("hours", hours);
    const minutes = Math.floor((timeDifference % 3600000) / 60000);
    const seconds = Math.floor((timeDifference % 60000) / 1000);

    const date = new Date(timestamp * 1000).getTime();
    let now = new Date().getTime();
    let daysLeft = date - now;
    const days = Math.floor(daysLeft / (1000 * 60 * 60 * 24));
    if (hours > 24) {
      return (
        <Box
          color="default"
          // label={`Active-${days} Days left`}
          sx={{
            position: "absolute",
            color: "white",
            padding: "2px 10px",
            right: 2,
            top: 2,
            zIndex: 1,
            backgroundColor: "seagreen",
            border: "1px solid seagreen",
            borderRadius: "50px",
            backdropFilter: "blur(40px)",
          }}
        >
          {`Active: ${days} Days left`}
        </Box>
      );
    } else if (hours < 0) {
      return (
        <Box
          color="default"
          // label={`Active-${days} Days left`}
          sx={{
            position: "absolute",
            color: "white",
            padding: "2px 10px",
            right: 2,
            top: 2,
            zIndex: 1,
            backgroundColor: "red",
            border: "1px solid red",
            borderRadius: "50px",
            backdropFilter: "blur(40px)",
          }}
        >
          {`Expired`}
        </Box>
      );
    } else {
      return `${hours}: ${minutes}: ${seconds} Left Live`;
      // <Chip
      //   color="default"
      //   label={`${hours}: ${minutes}: ${seconds} Left Live`}
      //   sx={{
      //     position: "absolute",
      //     color: "white",
      //     left: 10,
      //     top: 190,
      //     zIndex: 1,
      //     padding: "5px",
      //     backgroundColor: "#008555",
      //     backdropFilter: "blur(40px)",
      //   }}
      // />
    }
  };

  return (
    <Box>
      {available_tickets.isSuccess &&
        eventName.isSuccess &&
        eventSymbol.isSuccess &&
        initialTicketPrice.isSuccess &&
        eventStartDate.isSuccess && (
          <NavLink to={`/event/${index + 1}/${contract}`}>
            <Card maxW="sm" className="listing_card">
              {daysToGo(String(eventStartDate.data))}
              <CardBody>
                <Image
                  className="listing_card__image"
                  src={getImage(eventName.data)}
                  // src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt="Green double couch with wooden legs"
                  borderRadius="lg"
                  border={'1px solid #2d2d2d'}
                />
                <Stack mt="5" spacing="3" className="listing_card__content">
                  <Stack direction={"row"} justify={"space-between"}>
                    <Heading size="md" fontSize={"17px"} color={"black"}>
                      {eventName.data}
                    </Heading>
                    <Heading size="md" fontSize={"17px"} color={"black"}>
                      {eventSymbol.data}
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
                      {dateConverter(String(eventStartDate.data))}
                    </Text>
                  </Stack>

                  <Stack direction={"row"} justify={"space-between"}>
                    <Text color="grey" fontSize="md">
                      Available Tickets
                    </Text>
                    <Text color="grey" fontSize="md">
                      {String(available_tickets.data)}/
                      {String(ticketSupply.data)}
                    </Text>
                  </Stack>
                  <Stack direction={"row"} justify={"space-between"}>
                    <Text color="grey">Ticket Price</Text>
                    <Text color="grey">
                      {web3.utils.fromWei(String(initialTicketPrice.data))} ETH
                    </Text>
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
          </NavLink>
        )}
    </Box>
  );
};
