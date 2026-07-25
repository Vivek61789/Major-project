import React from "react";
import Layout from "../../components/layout/Layout";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContextAPI } from "../../components/context/DataContext";
import landingImage from "../../assets/landing.png";
import { TypeAnimation } from "react-type-animation";
import I1 from "../../assets/1.png";
import I2 from "../../assets/2.png";
import I3 from "../../assets/3.png";
import I4 from "../../assets/4.png";
import I5 from "../../assets/5.png";
import I6 from "../../assets/6.png";
import I7 from "../../assets/7.png";
import I8 from "../../assets/8.png";
import I9 from "../../assets/9.png";
import I10 from "../../assets/10.png";
import { useAccount } from "wagmi";
import Footer from "../../components/Footer/Footer";
const Ar = [I1, I2, I3, I4, I5, I6, I7, I8, I9, I10];
const imagesAr = [
  I1,
  I2,
  I3,
  I4,
  I5,
  I6,
  I7,
  I8,
  I9,
  I10,
  I9,
  I8,
  I6,
  I1,
  I2,
  I3,
  I10,
  I5,
  I4,
  I7,
];
const imagesAr1 = [
  I9,
  I8,
  I6,
  I1,
  I2,
  I3,
  I10,
  I5,
  I4,
  I7,
  I1,
  I2,
  I3,
  I4,
  I5,
  I6,
  I7,
  I8,
  I9,
];

const Landing = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };
  const [updatedImg, setUpdatedImg] = React.useState(Ar[0]);
  const organizer_status = localStorage.getItem("organizer_status");
  const { address } = useAccount();

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const max = Ar.length - 1; // Adjusted to avoid going out of array bounds
      const min = 0;
      const val = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log("-----", val);
      setUpdatedImg(Ar[val]);
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Layout>
        <Container maxW={"8xl"}>
          <SimpleGrid
            columns={{
              base: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 2,
            }}
            spacing={3}
            padding={3}
            // height={'100vh'}
          >
            <Stack flex={1} spacing={{ base: 10, md: 10 }}>
              <Box>
                <img
                  style={{
                    borderRadius: "10px",
                  }}
                  src={updatedImg}
                  alt="No Imgae"
                />
              </Box>

              <Heading lineHeight={1.1} fontWeight={600}>
                <Text
                  fontSize={"2xl"}
                  className="animate__animated animate__fadeInLeft"
                >
                  The Future of NFT Ticketing
                </Text>
                <Text
                  className="animate__animated animate__fadeInLeft"
                  color={"red.400"}
                  fontSize={{ sm: "3xl", lg: "2xl" }}
                >
                  in Web3 Era
                </Text>
              </Heading>

              <Box
                fontSize={{
                  base: "2xl",
                  sm: "3xl",
                  lg: "4xl",
                  xl: "4xl",
                  md: "2xl",
                }}
                fontWeight={"bold"}
                className="animate__animated animate__fadeInLeft "
              >
                <TypeAnimation
                  sequence={[
                    "NFT Tickets for Events",
                    1000,
                    "NFT Tickets for Concerts",
                    1000,
                    "NFT Tickets for Clubs",
                    1000,
                    "NFT Tickets for Arts",
                    1000,
                    "NFT Tickets for Parties",
                    1000,
                    "NFT Tickets for Hotels",
                    1000,
                  ]}
                  speed={25}
                  wrapper="span"
                  repeat={Infinity}
                />
              </Box>

              <Text
                color={"gray.500"}
                fontSize={{ sm: "1xl", lg: "1xl", md: "1xl", xl: "18px" }}
                className="animate__animated animate__fadeInLeft"
              >
                Welcoming NFT Event Ticketing, the next generation of event
                tickets, a tool that changes the way we enjoy live events.
                Instead of just selling tickets, we're using the power of
                blockchain technology to create unique digital assets that give
                people access to special events.
              </Text>
              <Stack
                spacing={{ base: 2, sm: 2 }}
                direction={{ base: "column", sm: "row" }}
              >
                <Button
                  borderRadius={"10px"}
                  fontWeight={"normal"}
                  color={"white"}
                  bg={"red.400"}
                  _hover={{ bg: "purple.300", color: "white" }}
                  className="animate__animated animate__fadeInLeft"
                  sx={{
                    textTransform: "uppercase",
                  }}
                  onClick={() => handleNavigate("/events")}
                >
                  Explore Events
                </Button>
                {organizer_status === "registered" && address && (
                  <Button
                    borderRadius={"10px"}
                    fontWeight={"normal"}
                    color={"white"}
                    // bg={"red.400"}
                    _hover={{ bg: "purple.300", color: "white" }}
                    className="animate__animated animate__fadeInLeft"
                    sx={{
                      textTransform: "uppercase",
                    }}
                    onClick={() => handleNavigate("/organizer-dashboard")}
                    variant={"outline"}
                  >
                    Dashboard
                  </Button>
                )}
                {organizer_status === "register" && address && (
                  <Button
                    borderRadius={"10px"}
                    fontWeight={"normal"}
                    color={"white"}
                    // bg={"red.400"}
                    _hover={{ bg: "purple.300", color: "white" }}
                    className="animate__animated animate__fadeInLeft"
                    sx={{
                      textTransform: "uppercase",
                    }}
                    onClick={() => handleNavigate("/register")}
                    variant={"outline"}
                  >
                    Register as Organizer
                  </Button>
                )}
              </Stack>
            </Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                height: "90vh",
              }}
            >
              <marquee
                direction="up"
                behavior="scroll"
                scrollamount="5"
                scrolldelay="100"
                loop="infinite"
                hspace="10"
                vspace="0"
              >
                <SimpleGrid
                  gap={4}
                  columns={{
                    base: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 1,
                  }}
                >
                  {imagesAr.map((ele, index) => {
                    return (
                      <Box key={index + 1}>
                        {" "}
                        <img
                          style={{ borderRadius: "10px" }}
                          src={ele}
                          alt="no"
                          height="150px"
                          width={"350px"}
                        />
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </marquee>
              <marquee
                direction="down"
                behavior="scroll"
                scrollamount="5"
                scrolldelay="100"
                loop="infinite"
                hspace="10"
                vspace="0"
              >
                <SimpleGrid
                  gap={4}
                  columns={{
                    base: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 1,
                  }}
                >
                  {imagesAr1.map((ele, index) => {
                    return (
                      <Box key={index + 1}>
                        {" "}
                        <img
                          style={{ borderRadius: "10px" }}
                          src={ele}
                          alt="no"
                          height="150px"
                          width={"350px"}
                        />
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </marquee>
            </Box>
          </SimpleGrid>
        </Container>
      </Layout>
      {/* <Footer /> */}
    </>
  );
};

export default Landing;
