import React, { useEffect, useState } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useFormik } from "formik";

import Layout from "../../components/layout/Layout";
import { object, string, number, date } from "yup";

import { web3 } from "../../configurations/alchemy/alchemyConfiguration";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { config } from "../../configurations/wagmi/Rainbowkit";
import factory_contract_abi from "../../contracts/factoryContract_ABI.json";
import json_config from "../../utils/config.json";
import axios from "axios";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

const Form1 = ({ formik }) => {
  return (
    <>
      <Heading
        w="100%"
        textAlign={"center"}
        fontSize={{
          base: "normal",
          sm: "large",
          md: "large",
          lg: "medium",
          xl: "normal",
        }}
        mb="2%"
        className="animate__animated animate__zoomIn"
      >
        Event Details
      </Heading>
      <FormControl
        mr="5%"
        isInvalid={formik.errors.eventName}
        className="animate__animated animate__slideInDown"
      >
        <FormLabel
          htmlFor="eventNameId"
          color={formik.errors.eventName ? "red.300" : ""}
        >
          Event Name
        </FormLabel>
        <Input
          id="eventNameId"
          name="eventName"
          type="text"
          variant="outline"
          placeholder="Event Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.eventName}
        />
        <FormErrorMessage>{formik.errors.eventName}</FormErrorMessage>
      </FormControl>
      <FormControl
        mt="2%"
        isInvalid={formik.errors.eventSymbol}
        className="animate__animated animate__slideInUp"
      >
        <FormLabel
          htmlFor="eventSymbolfor"
          fontWeight={"normal"}
          color={formik.errors.eventSymbol ? "red.300" : ""}
        >
          Event Symbol
        </FormLabel>
        <Input
          id="eventSymbolfor"
          type="text"
          name="eventSymbol"
          placeholder="Event Symbol"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.eventSymbol}
        />
        <FormErrorMessage>{formik.errors.eventSymbol}</FormErrorMessage>
      </FormControl>
    </>
  );
};

const Form2 = ({ formik }) => {
  return (
    <>
      <FormControl
        mr="5%"
        isInvalid={formik.errors.eventStartDate}
        className="animate__animated animate__slideInDown"
      >
        <FormLabel
          htmlFor="eventStartDateId"
          color={formik.errors.eventStartDate ? "red.300" : ""}
        >
          Event Start Date
        </FormLabel>
        <Input
          id="eventStartDateId"
          name="eventStartDate"
          type="datetime-local"
          variant="outline"
          placeholder="Revanth"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.eventStartDate}
        />
        <FormErrorMessage>{formik.errors.eventStartDate}</FormErrorMessage>
      </FormControl>
      <FormControl
        mt="2%"
        isInvalid={formik.errors.initialTicketPrice}
        className="animate__animated animate__slideInUp"
      >
        <FormLabel
          htmlFor="initialTicketPriceId"
          fontWeight={"normal"}
          color={formik.errors.initialTicketPrice ? "red.300" : ""}
        >
          Ticket Price (ETH)
        </FormLabel>
        <Input
          id="initialTicketPriceId"
          type="number"
          name="initialTicketPrice"
          placeholder="0.001 ETH"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.initialTicketPrice}
        />
        <FormErrorMessage>{formik.errors.initialTicketPrice}</FormErrorMessage>
      </FormControl>
    </>
  );
};

const Form3 = ({ formik }) => {
  return (
    <>
      <FormControl
        mr="5%"
        isInvalid={formik.errors.ticketSupply}
        className="animate__animated animate__slideInDown"
      >
        <FormLabel
          htmlFor="ticketSupplyId"
          color={formik.errors.ticketSupply ? "red.300" : ""}
        >
          Ticket Supply
        </FormLabel>
        <Input
          id="ticketSupplyId"
          name="ticketSupply"
          type="number"
          variant="outline"
          placeholder="1000"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ticketSupply}
        />
        <FormErrorMessage>{formik.errors.ticketSupply}</FormErrorMessage>
      </FormControl>
      {/* <FormControl mt="2%" className="animate__animated animate__slideInUp">
        <FormLabel htmlFor="organizerId" fontWeight={"normal"}>
          Organizer Address (Web3)
        </FormLabel>
        <Input
          disabled
          id="organizerId"
          type="number"
          name="organizer"
          value={formik.values.organizer}
        />
      </FormControl> */}
    </>
  );
};

const CreateEvent = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  console.log(address);
  const [submitBt, setSubmitBt] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  //formik
  const formik = useFormik({
    initialValues: {
      ticketSupply: "",
      initialTicketPrice: "",
      // maxPriceFactor: "",
      eventStartDate: "",
      eventName: "",
      eventSymbol: "",
      organizer: address,
    },
    validationSchema: object({
      eventName: string("event name").required("Event name Required"),
      eventSymbol: string("symbol").required("Event Symbol is required"),
      ticketSupply: number("only numbers")
        .required("ticket supply is required")
        .positive(),
      initialTicketPrice: number("only numbers")
        .required("initial Ticket Price required")
        .positive(),
      eventStartDate: date().required("Date is required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      //   converting to wei
      const princeInWEI = web3.utils.toWei(
        values.initialTicketPrice.toString()
      );
      console.log(princeInWEI);
      setSubmitBt(true);
      setSpinning(true);
      //   converting to timestamp
      const event_date = new Date(values.eventStartDate);
      const timestamp = event_date.getTime() / 1000;
      console.log(timestamp);

      toast({
        title: `Creating ${values.eventName} Event`,
        status: "loading",
        duration: 4000,
        isClosable: true,
        position: "top",
        variant: "solid",
      });

      // calling transaction
      createEventTransaction.writeContract({
        abi: factory_contract_abi,
        address: json_config.factory_contract,
        functionName: "createEvent",
        args: [
          values.eventName,
          values.eventSymbol,
          timestamp,
          values.ticketSupply,
          princeInWEI,
          address.toString(),
        ],
      });
    },
  });

  //   transaction setup...
  const createEventTransaction = useWriteContract({
    config: config,
    mutation: {
      onError(error, variables) {
        console.log("error onError", error);
        console.log("error onError:variables", variables);
        setSubmitBt(false);
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
          setSubmitBt(false);
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

  const deployedAddress = useReadContract({
    abi: factory_contract_abi,
    address: json_config.factory_contract,
    functionName: "getCFDeployedArray",
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
          setSubmitBt(false);
          setSpinning(false);
          toast({
            title: `Transaction Successful`,
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
          const d = await deployedAddress.refetch();
          console.log("re-fetched result", d.data);
          const reFetchedData = d.data;

          try {
            const response = await axios.post(
              json_config.saveEventDetailsByOrganizer,
              {
                organizer: formik.values.organizer,
                eventName: formik.values.eventName,
                eventSymbol: formik.values.eventSymbol,
                date: formik.values.eventStartDate,
                price: formik.values.initialTicketPrice,
                ticketSupply: formik.values.ticketSupply,
                event_count: 1,
                contract_address: reFetchedData[reFetchedData.length - 1],
              }
            );
            console.log("response", response);
            navigate("/events");
          } catch (error) {
            console.log(error);
            setSubmitBt(false);
            setSpinning(false);
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
      setSubmitBt(false);
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
      <Box color="white" height={'90vh'} >
        <Box
          borderWidth="1px"
          border={"1px solid #2d2d2d"}
          rounded="lg"
          // shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={1000}
          p={"0px 30px"}
          paddingBottom={"30px"}
          m="10px auto"
          as="form"
        >
          <Text
            align={"center"}
            fontSize={{
              base: "3xl",
              sm: "3xl",
              md: "3xl",
              lg: "5xl",
              xl: "4xl",
            }}
            //   marginTop={5}
            marginBottom={2}
            className="animate__animated animate__zoomIn"
          >
            Create Event
          </Text>
          <Progress hasStripe value={progress} mb="2%" isAnimated></Progress>
          {step === 1 && <Form1 formik={formik} />}
          {step === 2 && <Form2 formik={formik} />}
          {step === 3 && <Form3 formik={formik} />}
          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Flex className="animate__animated animate__fadeInUp">
                <Button
                  onClick={() => {
                    setStep(step - 1);
                    setProgress(progress - 33.33);
                  }}
                  isDisabled={step === 1 || submitBt}
                  colorScheme="red"
                  variant="solid"
                  w="7rem"
                  mr="5%"
                >
                  Back
                </Button>
                {step !== 3 ? (
                  <Button
                    w="7rem"
                    isDisabled={
                      step === 3 ||
                      (step === 1 &&
                        formik.errors.eventName &&
                        formik.errors.eventSymbol) ||
                      (step === 1 &&
                        !formik.values.eventName &&
                        !formik.values.eventSymbol) ||
                      (step === 2 &&
                        formik.errors.eventStartDate &&
                        formik.errors.initialTicketPrice) ||
                      (step === 2 &&
                        !formik.values.initialTicketPrice &&
                        !formik.values.initialTicketPrice)
                    }
                    onClick={() => {
                      setStep(step + 1);
                      if (step === 3) {
                        setProgress(100);
                      } else {
                        setProgress(progress + 33.33);
                      }
                    }}
                    colorScheme="teal"
                    variant="outline"
                  >
                    Next
                  </Button>
                ) : null}
              </Flex>
              {step === 3 ? (
                <Button
                  w="7rem"
                  colorScheme="red"
                  variant="solid"
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                  isDisabled={!(formik.isValid && formik.dirty) || submitBt}
                >
                  {submitBt ? "Creating..." : "Create"}
                </Button>
              ) : null}
            </Flex>
          </ButtonGroup>
        </Box>
      </Box>
      <Spin spinning={spinning} fullscreen size="large" />
    </Layout>
  );
};
export default CreateEvent;
