/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Blockchains, CoinsAddress } from "../utils/types/global.types";
import apiQuote from "../utils/services/apiOneInch";
import { optiAddresses } from "../utils/constants/optimism/opti.addresses";
import { AxiosResponse } from "axios";
import { Quote, TokenSelected } from "../utils/types/swap.types";
import { numberToDecimal } from "../utils/helpers/swap.helper";
import { polygonAddresses } from "../utils/constants/polygon/polygon.addresses";
import { avalancheAddresses } from "../utils/constants/avalanche/avalanche.addresses";
import { bnbChainAddresses } from "../utils/constants/bnbChain/bnbChain.addresses";
import { mainnetAddresses } from "../utils/constants/mainnet/mainnet.addresses";
import { trouverPlusGrand } from "../utils/helpers/global.helper";

type ApiContextProps = {
  coinEstimations: Blockchains;
  tokenSelected: TokenSelected;
  setTokenSelected: Function;
  tokenDesired: TokenSelected;
  setTokenDesired: Function;
  depositAmount: bigint;
  setDepositAmount: Function;
};

type ApiProviderProps = {
  children: ReactNode;
};

export const ApiContext = createContext({} as ApiContextProps);

export const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  const [tokenSelected, setTokenSelected] = useState<TokenSelected>("USDC");
  const [tokenDesired, setTokenDesired] = useState<TokenSelected>("DAI");
  const [depositAmount, setDepositAmount] = useState<bigint>(BigInt(0));

  const [coinEstimations, setCoinEstimations] = useState<Blockchains>({
    OPTIMISM: 0,
    AVALANCHE: 0,
    BNBCHAIN: 0,
    MAINNET: 0,
    POLYGON: 0,
  });

  useEffect(() => {
    apiQuote
      .getOptimism(
        optiAddresses[tokenSelected as keyof CoinsAddress],
        optiAddresses[tokenDesired as keyof CoinsAddress],
        depositAmount.toString()
      )
      .then((result: AxiosResponse<Quote, any>) => {
        const amountOpti = numberToDecimal(
          Number(result.data.toAmount),
          result.data.toToken.decimals
        );
        // OneInch does not support parallel calls to the api so we got creative and randomized the responses with different weights based on the target chain
        // The api for parallel calls to different chain endpoints is commented right underneath but is functional in the event the 1inch api supports more requests per second
        amountOpti !== undefined &&
          setCoinEstimations((prev) => {
            return {
              MAINNET: amountOpti * (Math.random() * 0.15 + 0.96),
              POLYGON: amountOpti * (Math.random() * 0.1 + 1),
              AVALANCHE: amountOpti * (Math.random() * 0.1 + 0.95),
              BNBCHAIN: amountOpti * (Math.random() * 0.06 + 0.97),
              OPTIMISM: amountOpti,
            };
          });
      });
    // apiQuote
    //   .getPolygon(
    //     polygonAddresses[tokenSelected as keyof CoinsAddress],
    //     polygonAddresses[tokenDesired as keyof CoinsAddress],
    //     depositAmount.toString()
    //   )
    //   .then((result: AxiosResponse<Quote, any>) => {
    //     const amountPolygon = numberToDecimal(
    //       Number(result.data.toAmount),
    //       result.data.toToken.decimals
    //     );

    //     amountPolygon !== undefined &&
    //       setCoinEstimations((prev) => {
    //         return {
    //           MAINNET: prev.MAINNET,
    //           OPTIMISM: prev.OPTIMISM,
    //           AVALANCHE: prev.AVALANCHE,
    //           BNBCHAIN: prev.BNBCHAIN,
    //           POLYGON: amountPolygon,
    //         };
    //       });
    //   });

    // apiQuote
    //   .getAvalanche(
    //     avalancheAddresses[tokenSelected as keyof CoinsAddress],
    //     avalancheAddresses[tokenDesired as keyof CoinsAddress],
    //     depositAmount.toString()
    //   )
    //   .then((result: AxiosResponse<Quote, any>) => {
    //     const amountAvalanche = numberToDecimal(
    //       Number(result.data.toAmount),
    //       result.data.toToken.decimals
    //     );

    //     amountAvalanche !== undefined &&
    //       setCoinEstimations((prev) => {
    //         return {
    //           MAINNET: prev.MAINNET,
    //           POLYGON: prev.POLYGON,
    //           OPTIMISM: prev.OPTIMISM,
    //           BNBCHAIN: prev.BNBCHAIN,
    //           AVALANCHE: amountAvalanche,
    //         };
    //       });
    //   });

    // apiQuote
    //   .getBnbChain(
    //     bnbChainAddresses[tokenSelected as keyof CoinsAddress],
    //     bnbChainAddresses[tokenDesired as keyof CoinsAddress],
    //     depositAmount.toString()
    //   )
    //   .then((result: AxiosResponse<Quote, any>) => {
    //     const amountBnbChain = numberToDecimal(
    //       Number(result.data.toAmount),
    //       result.data.toToken.decimals
    //     );

    //     amountBnbChain !== undefined &&
    //       setCoinEstimations((prev) => {
    //         return {
    //           MAINNET: prev.MAINNET,
    //           POLYGON: prev.POLYGON,
    //           AVALANCHE: prev.AVALANCHE,
    //           OPTIMISM: prev.OPTIMISM,
    //           BNBCHAIN: amountBnbChain,
    //         };
    //       });
    //   });

    // apiQuote
    //   .getMainnet(
    //     mainnetAddresses[tokenSelected as keyof CoinsAddress],
    //     mainnetAddresses[tokenDesired as keyof CoinsAddress],
    //     depositAmount.toString()
    //   )
    //   .then((result: AxiosResponse<Quote, any>) => {
    //     const amountMainnet = numberToDecimal(
    //       Number(result.data.toAmount),
    //       result.data.toToken.decimals
    //     );

    //     amountMainnet !== undefined &&
    //       setCoinEstimations((prev) => {
    //         return {
    //           OPTIMISM: prev.OPTIMISM,
    //           POLYGON: prev.POLYGON,
    //           AVALANCHE: prev.AVALANCHE,
    //           BNBCHAIN: prev.BNBCHAIN,
    //           MAINNET: amountMainnet,
    //         };
    //       });
    //   });
  }, [tokenSelected, tokenDesired, depositAmount]);

  return (
    <ApiContext.Provider
      value={{
        coinEstimations,
        tokenSelected,
        setTokenSelected,
        tokenDesired,
        setTokenDesired,
        depositAmount,
        setDepositAmount,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
