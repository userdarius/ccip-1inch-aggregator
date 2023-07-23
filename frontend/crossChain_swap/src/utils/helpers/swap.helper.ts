import axios from "axios";
import { Coins } from "../types/global.types";

export const getPrices = async (): Promise<Coins> => {
  const usdcPrice = await axios
    .get(
      "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd"
    )
    .then((response) => {
      return response.data["usd-coin"].usd;
    })
    .catch((err) => {
      throw new Error(err);
    });

  const daiPrice = await axios
    .get(
      "https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=usd"
    )
    .then((response) => {
      return response.data.dai.usd;
    })
    .catch((err) => {
      throw new Error(err);
    });

  const ethPrice = await axios
    .get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
    .then((response) => {
      return response.data.ethereum.usd;
    })
    .catch((err) => {
      throw new Error(err);
    });

  const btcPrice = await axios
    .get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    )
    .then((response) => {
      return response.data.bitcoin.usd;
    })
    .catch((err) => {
      throw new Error(err);
    });

  return {
    USDC: usdcPrice,
    DAI: daiPrice,
    ETH: ethPrice,
    BTC: btcPrice,
  };
};

export const displayBalance = (
  num: bigint | undefined,
  decimal: number | undefined
): string | undefined => {
  try {
    if (num !== undefined && decimal !== undefined) {
      return (Number(num / BigInt(10 ** (decimal - 4))) / 10 ** 4).toString();
    }
  } catch (error) {
    throw new Error("displayBalance  failed: " + error);
  }
};

export const stringToBigInt = (
  num: string | undefined,
  decimal: number | undefined
): bigint | undefined => {
  try {
    if (num !== undefined && decimal !== undefined) {
      return BigInt(Number(num) * 10 ** decimal);
    }
  } catch (error) {
    throw new Error("bigIntToDecimal failed : " + error);
  }
};

export const bigIntToDecimal = (
  num: bigint | undefined,
  decimal: number | undefined
): number | undefined => {
  try {
    if (num !== undefined && decimal !== undefined) {
      return Number(num) / 10 ** decimal;
    }
  } catch (error) {
    throw new Error("bigIntToDecimal failed : " + error);
  }
};

export const numberToDecimal = (
  num: number | undefined,
  decimal: number | undefined
): number | undefined => {
  try {
    if (num !== undefined && decimal !== undefined) {
      return Number(num) / 10 ** decimal;
    }
  } catch (error) {
    throw new Error("bigIntToDecimal failed : " + error);
  }
};
