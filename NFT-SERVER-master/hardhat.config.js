require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/cw1OYbvbyzQL2RTVYlz4ovJBRDkv_YMa",
      accounts: ["63b09a45a668af02a0a8cd7df59b395a292ee2f5cbfc8ed241dcbabd8bda17d3"]
    },
    holesky : {
      url: "https://eth-holesky.g.alchemy.com/v2/cw1OYbvbyzQL2RTVYlz4ovJBRDkv_YMa",
      accounts: ["2dffe2ed5d0c3ef82c565bc720f245ba82d93ffcea506ae165305e1c07860591"] //holesky
    },

    amoy:{
        url:'https://polygon-amoy.g.alchemy.com/v2/cw1OYbvbyzQL2RTVYlz4ovJBRDkv_YMa',
        // accounts:['bd481d38af001a172200919f9903cb837107948a4acbd46c7268e84f1fae08f7'] //fdb2
        // accounts:['2dffe2ed5d0c3ef82c565bc720f245ba82d93ffcea506ae165305e1c07860591'], //ad6,
        accounts:['6af887ea098e4f99889293633781fafa6d163ceb63a30d516218de9b36970337'], //FaA,
        // gas: 2100000,
        // gasPrice: 8000000000,
    }
  },
  gasReporter: {
    enabled: true,
    currency: "ETH"
  },
  etherscan: {
    apiKey: 'Q9I246DK2CGB9M7C41FD9K2RKVV26DGTR7',
    customChains: [
      {
        network: "holesky",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api",
        browserURL: "https://holesky.etherscan.io"
        }
      },
      {
        network: "amoy",
        chainId: 80002,
        urls: {
        //   apiURL: "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/"
        //   browserURL: "https://www.oklink.com/polygonAmoy"
        },
    }
    ]
  },
//   polygonscan:{
//     apiKey:"Q9I246DK2CGB9M7C41FD9K2RKVV26DGTR7"
//   },
  docgen: {}
};

