
const hre = require("hardhat");

async function deploy() {


  // We get the contract to deploy
  console.log("Initiated")
  const Greeter = await hre.ethers.getContractFactory("EventFactory");
  // const Greeter = await hre.ethers.getContractFactory("NFTEventTicket");
  console.log(Greeter);
  const greeter = await Greeter.deploy(); //sepolia
//   const greeter = await Greeter.deploy("GaniSepolia","GS","1719228648",100,100000000000,'0x095aB34A52423507706a346B23684532A9BC97a5'); //sepolia
//   const greeter = await Greeter.deploy("GaniRockks","GR","1719228648",100,100000000000,'0x4024C8e79bd5006171A3D5560Aead5740Eb63ad6'); //holesky
  // const greeter = await Greeter.deploy("GaniRockks","GR","1724962410",100,100000000000,'0x4024C8e79bd5006171A3D5560Aead5740Eb63ad6'); //amoy
  console.log("contract Invoked")
  await greeter.deployed();
  console.log("contract deployed")
  console.log("Contract deployed to from deploy file:", greeter.address);
}

module.exports = {deploy};

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//npx hardhat compile
//npx hardhat --network amoy run deploy.js
//npx hardhat verify "0xf1A917281631521C0f6B9DC7DA72dC8132032fA5" --network sepolia "GaniRocks" "GR" "1724962410" 100 100000000000 '0x095aB34A52423507706a346B23684532A9BC97a5'                  
//npx hardhat verify "0xB95A72E9B93aD0cAAeDB1bC38Cf938D06A8D8E2D" --network holesky "GaniRockks" "GR" "1724962410" 100 100000000000 '0x4024C8e79bd5006171A3D5560Aead5740Eb63ad6'                  
//npx hardhat verify "0xfB4a558a998789b2f245b55c9471E8ce001cD4de" --network amoy "TEST" "T" "1727674786" 100 100000000000 '0x22c688A8bc69d40ffeB2BB90e534f0b91DEeFdb2'                  
// new contract 0x86F2D6382eF13F632Db0ae819f7d65A21Cf89533 


// npx hardhat verify "0x24F35f2e29297eD64a9378Ad38a0d1856D538e2b" --network amoy "Vibe Night" "VN" "1725021000" 900 10000000000000 "0x4024C8e79bd5006171A3D5560Aead5740Eb63ad6"


