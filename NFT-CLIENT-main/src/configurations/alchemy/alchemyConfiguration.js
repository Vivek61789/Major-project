
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

// alchemy provider set-up
const alchemyKey = "https://polygon-amoy.g.alchemy.com/v2/cw1OYbvbyzQL2RTVYlz4ovJBRDkv_YMa";//base url from alchemy
export const web3 = createAlchemyWeb3(alchemyKey);
export default web3;
