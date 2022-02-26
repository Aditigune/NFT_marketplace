require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();
const projectId = "a79d960379aa412b834abd7f4eafb73d"; // next-polygon
//const projectId = "fd500644ac1844029322c307abff1574"; //test

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      //url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      //url: `https://rpc-mumbai.matic.today`,
      url: `https://matic-mumbai.chainstacklabs.com`,
      // url: `https://polygon-mumbai.infura.io/v3/a79d960379aa412b834abd7f4eafb73d`,
      accounts: [privateKey],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey],
    },
  },
  solidity: "0.8.4",
};
