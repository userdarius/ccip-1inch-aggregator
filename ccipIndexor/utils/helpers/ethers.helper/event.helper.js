const { ethers } = require("ethers");
const { addressTokenRouter } = require("../../constants/adresses/tokenRouter");
const { abiTokenRouter } = require("../../constants/abis/tokenRouter");
const { swapOneInch } = require("./write.helper");

require("dotenv").config();

const listenTokenRouter = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`
    );
    const tokenRouter_Contract = new ethers.Contract(
      addressTokenRouter,
      abiTokenRouter,
      provider
    );

    tokenRouter_Contract.on("*", (...args) => {
      if (args[0].log.fragment.name === "MessageReceived") {
        const [messageId, sourceChainSelector, sender, message, amount] =
          args[0].log.args;
        //call api swap offchain

        //write swap entrypoint
        var caller;
        var desc;
        var data;
        swapOneInch(caller, desc, data);
      }
      if (args[0].log.fragment.name === "MessageSent") {
        const [messageId, sourceChainSelector, sender, message, amount] =
          args[0].log.args;
      }
      if (args[0].log.fragment.name === "SwapCompletedOnDestination") {
        const [message] = args[0].log.args;
      }
    });
  } catch (error) {
    throw error("listenTokenRouter failed: " + error);
  }
};

module.exports = {
  listenTokenRouter,
};
