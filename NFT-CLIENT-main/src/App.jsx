import React from "react";

import "./App.css";

// import WagmiConfiguration from "./configurations/wagmi/WagmiConfiguration";
import Header from "./components/Header/Header";
import RainbowKit from "./configurations/wagmi/Rainbowkit";
import { ChakraProvider } from "@chakra-ui/react";
import DataContextAPI from "./components/context/DataContext";
import Register from "./pages/auth/Register";
import { ConfigProvider, theme } from "antd";
import AppRoutes from "./app_routes/App_Routes";

function App() {
  return (
    <ChakraProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <DataContextAPI>
          <RainbowKit>
            <Header />
            <AppRoutes />
          </RainbowKit>
        </DataContextAPI>
      </ConfigProvider>
    </ChakraProvider>
  );
}

export default App;
