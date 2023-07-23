const { ethers } = require("ethers");
const { addressTokenRouter } = require("../../constants/adresses/tokenRouter");
const { abiTokenRouter } = require("../../constants/abis/tokenRouter");
const { swapOneInch } = require("./write.helper");
const { axios } = require("axios");

require("dotenv").config();

const listenTokenRouter = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(
      "https://sepolia.gateway.tenderly.co"
    );
    const tokenRouter_Contract = new ethers.Contract(
      addressTokenRouter,
      abiTokenRouter,
      provider
    );

    tokenRouter_Contract.on("*", async (...args) => {
      if (args[0].log.fragment.name === "MessageReceived") {
        const [
          messageId,
          sourceChainSelector,
          sender,
          message,
          tokenSource,
          tokenY,
          amount,
        ] = args[0].log.args;
        //call api swap offchain
        const result = await axios.get("http://localhost:6002/swap/mainnet/", {
          params: {
            src: tokenSource,
            dst: tokenY,
            amount: amount,
          },
        });
        // response.data
        //   {
        //     "toAmount": "42295727",
        //     "tx": {
        //         "from": "0x01738387092E007CcB8B5a73Fac2a9BA23cf91d3",
        //         "to": "0x1111111254eeb25477b68fb85ed929f73a960582",
        //         "data": "0x0502b1c5000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000005083299d1aa40300000000000000000000000000000000000000000000000000000000027eed810000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b6d0340397ff1542f962076d0bfe58ea045ffa2d347aca08b1ccac8",
        //         "value": "0",
        //         "gas": 0,
        //         "gasPrice": "12328741240"
        //     }
        // }

        //write swap entrypoint
        // 1inch v5: Aggregation router
        var caller = "0x1111111254EEB25477B68fb85Ed929f73A960582";
        var desc = result.data;
        var data = result.data.tx.data;
        const resultSwap = await swapOneInch(caller, desc, data);
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
