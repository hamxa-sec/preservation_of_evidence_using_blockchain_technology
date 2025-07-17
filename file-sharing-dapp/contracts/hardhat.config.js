require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test",
  },
  networks: {
    development: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    sepolia: {
      url: process.env.INFURA_URL || "https://sepolia.infura.io/v3/d8b7e501ab9c42d684933e2af688d89c",
      accounts: process.env.MNEMONIC ? [process.env.MNEMONIC] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "5PTMNERH2VV5CYHNJ85XI62GZ27Q2C8BSX",
  },
};
