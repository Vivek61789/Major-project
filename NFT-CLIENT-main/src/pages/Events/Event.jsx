import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import contractABI from "../../contracts/event_abi.json";
import { useReadContracts } from "wagmi";
import web3 from "../../configurations/alchemy/alchemyConfiguration";
import { MdOutlineEventAvailable } from "react-icons/md";
import { RiTimerLine } from "react-icons/ri";
import { FaSackDollar } from "react-icons/fa6";

import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
  Box,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { IoPersonSharp } from "react-icons/io5";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import axios from "axios";
import { config } from "../../configurations/wagmi/Rainbowkit";
import { useToast } from "@chakra-ui/react";
import { useAccount, useWriteContract } from "wagmi";
import contract_abi from "../../contracts/event_abi.json";
import json from "../../utils/config.json";
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
import { Spin } from "antd";

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

const getDescription = (name) => {
  console.log("****", name);
  const singleWord = name.replace(/\s+/g, "").toUpperCase();
  if (singleWord === "HARMONYANDBEATS") {
    return "Tune in to Harmony and Beats to hear musicians from all over the world playing together in a symphony of sounds that connects people of all backgrounds and musical styles.";
  } else if (singleWord === "WORLDMUSICWAVE") {
    return "Dive into the ocean of global rhythms at the World Music Wave Concert, where melodies from every corner of the earth converge to create a musical tidal wave of unity and joy.";
  } else if (singleWord === "SNAPSHOTSTORIES") {
    return "Get to the heart of life through the lens at Snapshot Stories, a photography festival that shows off the skill of catching moments that say a thousand words.";
  } else if (singleWord === "LENSLUMINARIES") {
    return "Immerse yourself in the realm of photography like never before with Lens Luminaries. This extraordinary collection of works from world-renowned photographers will light up your creative path and ignite your imagination.";
  } else if (singleWord === "COLORSOFTHEWORLD") {
    return "Colors of the World invites you to join in the excitement of Holi, a festival that celebrates the triumph of good over evil and the coming of spring via the use of brilliant colours.";
  } else if (singleWord === "ARITISTICODYSSEY") {
    return "Artistic Odyssey is a visual feast that takes you on an artistic journey as artists reveal their works of art, delving into the depths of creativity and imagination.";
  } else if (singleWord === "ARITISTICAMALGAM") {
    return "Artistic Amalgam is an art exhibition that showcases the ever-changing growth of art via the merging of styles and materials with classic techniques and modern expressions.";
  } else if (singleWord === "MEDIAMOSAIC") {
    return "Experience entertainment like never before at Media Mosaic, a multimedia event that dives into the digital era via immersive experiences that redefine art, technology, and media.";
  } else if (singleWord === "FUTURISTICFANTASIES") {
    return "Join us at Futuristic Fantasies, a tech event that explores the latest breakthroughs reshaping our world. We'll go deep into topics like Virtual Reality and Artificial Intelligence, rethinking what the future holds.";
  } else if (singleWord === "DIGITALDREAMS") {
    return "Come on a digital adventure with us at Digital Dreams, an exhibition that showcases the cutting edge of digital art, where pixels depict the dreams of the future.";
  } else {
    return "Come on a digital adventure with us at Digital Dreams, an exhibition that showcases the cutting edge of digital art, where pixels depict the dreams of the future.";
  }
};

const getImageForMetadata = (name) => {
  const singleWord = name.replace(/\s+/g, "").toUpperCase();
  if (singleWord === "HARMONYANDBEATS") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/1.png";
  } else if (singleWord === "WORLDMUSICWAVE") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/2.png";
  } else if (singleWord === "SNAPSHOTSTORIES") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/3.png";
  } else if (singleWord === "LENSLUMINARIES") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/4.png";
  } else if (singleWord === "COLORSOFTHEWORLD") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/5.png";
  } else if (singleWord === "ARITISTICODYSSEY") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/6.png";
  } else if (singleWord === "ARITISTICAMALGAM") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/7.png";
  } else if (singleWord === "MEDIAMOSAIC") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/8.png";
  } else if (singleWord === "FUTURISTICFANTASIES") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/9.png";
  } else if (singleWord === "DIGITALDREAMS") {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/10.png";
  } else {
    return "https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/10.png";
  }
};

const Event = () => {
  const toast = useToast();
  const screens = useBreakpoint();
  const { address } = useAccount();

  const params = useParams();

  function isTimePassed(timestamp) {
    const now = new Date();
    const targetTime = new Date(+timestamp * 1000);
    const diffInMilliseconds = targetTime - now;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return diffInHours < -24 ? true : false;
  }

  const eventContract = {
    address: params?.contract,
    abi: contractABI,
  };
  //read contracts data
  const result = useReadContracts({
    contracts: [
      {
        ...eventContract,
        functionName: "eventName",
      },
      {
        ...eventContract,
        functionName: "eventSymbol",
      },
      {
        ...eventContract,
        functionName: "availableTickets",
      },
      {
        ...eventContract,
        functionName: "eventStartDate",
      },
      {
        ...eventContract,
        functionName: "initialTicketPrice",
      },
      {
        ...eventContract,
        functionName: "organizer",
      },
      {
        ...eventContract,
        functionName: "ticketSupply",
      },
    ],
  });

  const dateConverter = (timestamp) => {
    console.log("timestamp", timestamp);
    const date = new Date(+timestamp * 1000);
    return date.toLocaleString() + " London, UK.";
  };

  // ticket msg state
  const [navigateLink, setNavigateLink] = useState(false);
  const [navigateLinkText, setNavigateLinkText] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [buyLoad, setBuyLoad] = useState(false);
  // buy ticket
  const buyTicket = async () => {
    setBuyLoad(true);
    setSpinning(true);

    // clearing navigation link
    setNavigateLink(false);

    // getting the pinata hash for metedata

    //make metadata
    const metadata = new Object();
    metadata.name = result.data[0].result;
    // https://fuchsia-alert-guineafowl-926.mypinata.cloud/ipfs/QmY9ZQuJDN6W1MPvcXLxXpBdFvM6PDixiXqWRJa74hvo3w/1.png
    metadata.image = getImageForMetadata(result.data[0].result);
    metadata.description = getDescription(result.data[0].result);
    metadata.attributes = [
      {
        trait_type: "Event Symbol",
        value: result.data[1].result,
      },
      {
        trait_type: "Place",
        value: "London UK",
      },
      {
        trait_type: "Organizer",
        value:
          String(result.data[5].result).substring(0, 8) +
          "......" +
          String(result.data[5].result).substring(38),
      },
      {
        display_type: "date",
        trait_type: "Event Start Date",
        value: dateConverter(String(result.data[3].result)),
      },
    ];

    console.log("metadata", metadata);

    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI = pinataResponse.pinataUrl;
    console.log("tokenURI", tokenURI);

    // making blockchain call
    // calling transaction
    buyTicketTransaction.writeContract({
      abi: contract_abi,
      address: params?.contract,
      functionName: "buyTicket",
      args: [tokenURI],
      value: result.data[4].result,
    });
  };

  const key = "1d2ff232c98a14c22301";
  // const key = "5c734267c3371dd844bd";
  const secret =
    "d0cfe535ccaba7d0ad70c446c411ece19519fdd096bd24b5df4f18a906dec47a";
  // "47773c90ff7c1101b1da0236c76beb636c1ef332f2fe3afb75eb221f459ebffc";
  // https://testnets.opensea.io/assets/amoy/${params?.contract}/1

  const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
      .post(url, JSONBody, {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: key,
          pinata_secret_key: secret,
          Authorization: `Bearer ${json.PINATA_JWT}`,
        },
      })
      .then(function (response) {
        console.log("pinata res", response);
        return {
          success: true,
          pinataUrl: response.data.IpfsHash,
          // "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        };
      })
      .catch(function (error) {
        console.log(error);
        setBuyLoad(false);
        setSpinning(false);
        return {
          success: false,
          message: error.message,
        };
      });
  };

  const buyTicketTransaction = useWriteContract({
    config: config,
    mutation: {
      onError(error, variables) {
        console.log("error onError", error);
        console.log("error onError:variables", variables);
        setBuyLoad(false);
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
          setBuyLoad(false);
          setSpinning(false);
        } else {
          toast({
            title: "Verifying Tx",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          console.log("transaction hash", data);
          // transaction status
          transactionReceipt(data);
        }
      },
    },
  });

  //   verifying transaction...
  const transactionReceipt = async (txHash) => {
    console.log("tx-hash-transactionReceipt: ", txHash);
    try {
      //checking for recipe using alchemy
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (receipt) {
        console.log("transaction receipt", receipt);
        if (receipt.status) {
          console.log("transactionRecipet Transaction was successful!");
          setSpinning(false);
          setBuyLoad(false);
          const availableTicketsCount = String(result.data[2].result);
          const ticketSupplyCount = String(result.data[6].result);
          const ticketID = ticketSupplyCount - availableTicketsCount;

          // console.log("availableTicketsCount", availableTicketsCount);
          // console.log("ticketSupplyCount", ticketSupplyCount);
          // console.log("ticketID", ticketID);

          setNavigateLink(true);
          setNavigateLinkText(
            `https://testnets.opensea.io/assets/amoy/${params?.contract}/${
              ticketID + 1
            }`
          );
          toast({
            title: `Transaction Successful`,
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
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
      setBuyLoad(false);
      setSpinning(false);
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
      // Handle errors appropriately in your application.
    }
  };

  return (
    <Layout>
      {result.isLoading ? (
        <Container maxW={"8xl"} py={5}>
          <Stack
            direction={{
              base: "column",
              md: "row",
              xl: "row",
              lg: "row",
            }}
          >
            <Box width={"50%"} borderRadius={"20px"} p={1}>
              <SkeletonText
                mt="4"
                noOfLines={1}
                spacing="4"
                skeletonHeight="400"
              />
            </Box>
            <Box p={1} width={"50%"} borderRadius={"20px"}>
              <SkeletonText
                mt="4"
                noOfLines={15}
                spacing="4"
                skeletonHeight="2"
              />
            </Box>
          </Stack>
          <Box borderRadius={"20px"}>
            <SkeletonText
              mt="4"
              noOfLines={15}
              spacing="4"
              skeletonHeight="2"
            />
          </Box>
        </Container>
      ) : result.data && !result.error ? (
        <Container maxW={"8xl"} py={5}>
          <Breadcrumb pb={3}>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <NavLink to={"/"}>Home</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <NavLink to={"/events"}>Events</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage color={"grey"}>
              <BreadcrumbLink href="#">{result?.data[0].result}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Flex border={'1px solid #2d2d2d'} borderRadius={'10px'}>
              <Image
                rounded={"md"}
                alt={"feature image"}
                src={getImage(result?.data[0].result)}
                // src={
                //   "https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                // }
                objectFit={"contain"}
                height={"100%"}
              />
            </Flex>
            <Stack spacing={4}>
              {isTimePassed(String(result.data[3].result)) ? (
                <Text
                  textTransform={"uppercase"}
                  color={"white"}
                  fontWeight={600}
                  fontSize={"sm"}
                  bg={"red"}
                  p={2}
                  alignSelf={"flex-start"}
                  rounded={"md"}
                >
                  Ended
                </Text>
              ) : (
                <Text
                  textTransform={"uppercase"}
                  color={"white"}
                  fontWeight={600}
                  fontSize={"sm"}
                  bg={"green.600"}
                  p={2}
                  alignSelf={"flex-start"}
                  rounded={"md"}
                >
                  LIVE
                </Text>
              )}

              <Heading color={"gray.300"}>
                {result?.data[0].result}-{result?.data[1].result}
              </Heading>
              <Text color={"gray.500"} fontSize={"lg"}>
                {getDescription(result?.data[0].result)}
              </Text>
              <Stack
                spacing={4}
                divider={
                  <StackDivider
                    borderColor={useColorModeValue("gray.100", "gray.700")}
                  />
                }
              >
                <Feature
                  icon={
                    <Icon
                      as={MdOutlineEventAvailable}
                      color={"yellow.500"}
                      w={5}
                      h={5}
                    />
                  }
                  iconBg={useColorModeValue("yellow.100", "yellow.900")}
                  text={"Available Tickets"}
                  value={`${String(result.data[2].result)}/${String(
                    result.data[6].result
                  )}`}
                />
                <Feature
                  icon={
                    <Icon as={RiTimerLine} color={"green.500"} w={5} h={5} />
                  }
                  iconBg={useColorModeValue("green.100", "green.900")}
                  text={"Time"}
                  value={dateConverter(String(result.data[3].result))}
                />
                <Feature
                  icon={
                    <Icon as={FaSackDollar} color={"orange.500"} w={5} h={5} />
                  }
                  iconBg={useColorModeValue("orange.100", "orange.900")}
                  text={"Price"}
                  value={
                    web3.utils.fromWei(String(result.data[4].result)) + " MATIC"
                  }
                />
                <Feature
                  icon={
                    <Icon as={IoPersonSharp} color={"purple.500"} w={5} h={5} />
                  }
                  iconBg={useColorModeValue("purple.100", "purple.900")}
                  text={"Organizer"}
                  value={
                    String(result.data[5].result).substring(0, 8) +
                    "......" +
                    String(result.data[5].result).substring(38)
                  }
                />
                <Button
                  type="button"
                  background={"#7e02f9"}
                  onClick={buyTicket}
                  isDisabled={
                    !address ||
                    buyLoad ||
                    String(result.data[2].result) === "0" ||
                    isTimePassed(String(result.data[3].result))
                  }
                >
                  {buyLoad ? "Purchasing..." : "Buy"}
                </Button>
                {navigateLink && (
                  <>
                  Ticket Link:
                    <a
                      target="_blank"
                      style={{
                        color: "#4e4edd",
                        textDecoration:'underline'
                      }}
                      href={`${navigateLinkText}`}
                    >
                      {navigateLinkText}
                      Ticket Link:  
                    </a>
                  </>
                )}
                {/* <Button
                  isLoading
                  colorScheme="blue"
                  // spinner={<BeatLoader size={8} color="white" />}
                >
                  Click me
                </Button> */}
              </Stack>
            </Stack>
          </SimpleGrid>

          <Box pt={5}>
            <Text fontSize="3xl" color={"gray.200"}>
              About Organizer
            </Text>
            <Text pb={2} fontWeight={"light"} color={"grey"}>
              {String(result.data[5].result)}
            </Text>
            <Text color={"gray.300"} textAlign={"justify"}>
              As an experienced event planner, I specialize in crafting
              unforgettable experiences across a diverse range of events. My
              passion for creating memorable moments shines through in
              everything I do. Whether it’s orchestrating vibrant music
              festivals, curating thought-provoking art exhibitions, organizing
              innovative tech conferences, or staging captivating photography
              showcases, I excel at bringing a wide array of ideas to life. I
              pride myself on my ability to merge creativity with meticulous
              planning to ensure every event is not only unique but also
              flawlessly executed. My approach involves a keen attention to
              detail and a proactive problem-solving mindset, which allows me to
              anticipate and address challenges before they arise. This
              dedication ensures that each event not only meets but exceeds the
              expectations of clients and attendees alike. By focusing on both
              the grand vision and the smallest details, I transform abstract
              concepts into tangible realities, leaving a lasting impression on
              everyone involved. My goal is to create events that are not just
              successful but truly unforgettable, making a meaningful impact
              long after the final curtain falls.
            </Text>
          </Box>
        </Container>
      ) : (
        result.error && "Error while fetching data from Blockchain"
      )}
      <Spin spinning={spinning} fullscreen size="large" />
    </Layout>
  );
};

export default Event;

const Feature = ({ text, icon, iconBg, value }) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex
        w={8}
        h={8}
        align={"center"}
        justify={"center"}
        rounded={"full"}
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Stack width={"100%"} direction="row" justify={"space-between"}>
        <Text color={"gray.300"} fontWeight={600}>
          {text}
        </Text>
        <Text color={"gray.300"} fontWeight={600}>
          {value}
        </Text>
      </Stack>
    </Stack>
  );
};
