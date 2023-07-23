const { Interface } = require("ethers");
require("dotenv").config();

const convertAbi = () => {
  try {
    // enter here view,write & event that you want to convert from Human-Readable ABI to Solidity JSON ABI
    const humanReadableAbi = [
      "event TotalSupplyUpdated(address indexed fiAsset, uint256 assets, uint256 yield, uint256 rCPT, uint256 fee)",
      "event Deposit(address indexed asset, uint256 amount, address indexed depositFrom, uint256 fee)",
      "event Withdraw(address indexed asset, uint256 amount, address indexed depositFrom, uint256 fee)",
    ];

    const iface = new Interface(humanReadableAbi);

    console.log(JSON.stringify(iface.fragments, null, 2));
  } catch (error) {
    throw error("convertAbi failed : " + error);
  }
};

module.exports = {
  convertAbi,
};
