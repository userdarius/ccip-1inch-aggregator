const { ethers } = require("ethers");
const { addressOneInchMainnet } = require("../../constants/adresses/OneInch");
const { abiOneInch } = require("../../constants/abis/oneInch");

const swapOneInch = async (caller, desc, data) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.API_KEY_MAINNET}`
    );
    const signer = new ethers.Wallet(process.env.SECRET_KEY, provider);
    const OneInchContract = await new ethers.Contract(
      addressOneInchMainnet,
      abiOneInch,
      signer
    );

    await OneInchContract.swap(caller, desc, data);
  } catch (error) {
    throw Error("toggleWhitelist failed: " + error);
  }
};

module.exports = {
  swapOneInch,
};
