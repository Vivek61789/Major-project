import React, { useEffect, useState } from "react";
// import ContentWrapper from "../components/Layout/ContentWrapper";
import { Button, Form, Input, message, Spin } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useContextAPI } from "../../components/context/DataContext";
import config from "../../utils/config.json";

const Register = () => {
  //screen breakpoints
  const screens = useBreakpoint();
  const [spinning, setSpinning] = useState(false);
  // register bt load
  const [load, setLoad] = useState(false);
  //navigating
  const navigate = useNavigate();
  //antd form and message and key
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  //   context
  const { jwtStatus, setOrgStatus } = useContextAPI();

  //   wagmi
  const { address } = useAccount();

  /**
   * @dev register function
   */
  const createOrganizer = async () => {
    setLoad(true);
    setSpinning(true);
    try {
      const values = await form.validateFields();
      if (values) {
        messageApi.open({
          key,
          type: "loading",
          content: "Registering...",
        });
        console.log(values);
        const response = await axios.post(config.saveOrganizerDetails_api, {
          token: localStorage.getItem("jwtToken"),
          address: values.organizer_name,
          email: values.organizer_email,
          organizer_name: values.organizer_name,
          organization_name: values.organization_name,
        });
        if (response.status === 200) {
          console.log(response.data);
          localStorage.setItem("user_id", response.data.user_id);
          localStorage.setItem("organizer_status", "registered");
          setOrgStatus("registered");
          setTimeout(() => {
            messageApi.open({
              type: "success",
              content: "Registered..🤩 Successfully",
              duration: 2,
            });
          }, 1000);
          localStorage.setItem("organizer_status", "registered");
          setTimeout(() => {
            setSpinning(false);
            form.resetFields();
            navigate("/");
            setLoad(false);
          }, 2000);
        }
      }
    } catch (error) {
      setLoad(false);
      setSpinning(false);
      console.log(error);
      messageApi.open({
        type: "error",
        content: `Registration Failed🥲🥲 ${error.response.data.message}`,
        duration: 3,
      });
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: screens.xs === true ? "500px" : "650px",
        backgroundColor: "rgb(6 6 6)",
        padding: screens.xs ? "25px" : "0px",
      }}
    >
      {contextHolder}
      {jwtStatus ? (
        <div
          style={{
            border: "1px solid gray",
            width: "600px",
            padding: screens.xs === true ? "30px 20px" : "40px",
            borderRadius: 10,
            // boxShadow: "0px 0px 10px 1px #4c4b4b",
            boxShadow:
              "0 0 5px 1px rgba(65, 88, 208, 0.5), 0 0 5px 1px rgba(200, 80, 192, 0.5),0 0 5px 1px rgba(255, 204, 112, 0.5)",
          }}
        >
          <Text
            style={{
              textAlign: "center",
            }}
            className="poppins-regular"
            fontSize="3xl"
            color={"white"}
          >
            Register
          </Text>
          <Form
            form={form}
            name="dynamic_rule"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "10px",
            }}
            layout="vertical"
          >
            <Form.Item
              name="organizer_address"
              hasFeedback
              label="Organizer Address"
              initialValue={address}
            >
              <Input
                disabled
                placeholder="John"
                style={{
                  width: screens.xs ? "300px" : "400px",
                }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="organizer_name"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Name is required!",
                },
              ]}
              label="Organizer Name"
              style={{
                color: "white !important",
              }}
            >
              <Input
                placeholder="John"
                style={{
                  width: screens.xs ? "300px" : "400px",
                }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="organization_name"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Organization Name is required!",
                },
              ]}
              label="Organization Name"
            >
              <Input
                placeholder="John"
                style={{
                  width: screens.xs ? "300px" : "400px",
                }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="organizer_email"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Email is required!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
              ]}
              label="Email"
            >
              <Input
                placeholder="John@gmail.com"
                style={{
                  width: screens.xs ? "300px" : "400px",
                }}
                size="large"
              />
            </Form.Item>

            <Button
              onClick={createOrganizer}
              type="primary"
              size="middle"
              htmlType="submit"
              loading={load}
            >
              Register
            </Button>
          </Form>
        </div>
      ) : address ? (
        "loading...."
      ) : (
        "Please connect wallet to register"
      )}

      <Spin spinning={spinning} fullscreen size="large" />
    </div>
  );
};

export default Register;
