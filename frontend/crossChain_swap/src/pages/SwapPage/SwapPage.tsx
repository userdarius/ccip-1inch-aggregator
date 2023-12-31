import React, { useContext, useEffect, useMemo, useState } from "react";
import { ReactComponent as USDC } from "../../assets/tokens/USDC.svg";
import { ReactComponent as BTCLogo } from "../../assets/tokens/BTCLogo.svg";
import { ReactComponent as ETHLogo } from "../../assets/tokens/ETHLogo.svg";
import { ReactComponent as DaiLogo } from "../../assets/tokens/DAILogo.svg";
import { Token } from "../../utils/types/swap.types";
import ListboxComponent from "../../components/ListboxComponent/ListboxComponent";
import { ReactComponent as DoubleArrowWithBar } from "../../assets/icons/ArrowSwitch.svg";
import { SwapContext } from "../../context/Swap.context";
import {
  bigIntToDecimal,
  displayBalance,
  stringToBigInt,
} from "../../utils/helpers/swap.helper";
import { Coins } from "../../utils/types/global.types";
import { optiDecimals } from "../../utils/constants/optimism/opti.addresses";
import CardEstimation from "./CardEstimation/CardEstimation";
import { ApiContext } from "../../context/Api.context";
import { trouverPlusGrand } from "../../utils/helpers/global.helper";
import { useAccount } from "wagmi";

const SwapPage = () => {
  const [listCoins] = useState<Token[]>([
    { name: "USDC", svgLogo: USDC },
    { name: "DAI", svgLogo: DaiLogo },
    { name: "ETH", svgLogo: ETHLogo },
    { name: "BTC", svgLogo: BTCLogo },
  ]);

  const { balanceCoins, pricesCoins } = useContext(SwapContext);
  const { isConnected } = useAccount();

  const {
    tokenSelected,
    tokenDesired,
    coinEstimations,
    depositAmount,
    setDepositAmount,
  } = useContext(ApiContext);

  const result = useMemo(() => {
    return trouverPlusGrand(coinEstimations);
  }, [coinEstimations]);

  const estimatedReceiving = useMemo(() => {
    return result.estimatedReceiving;
  }, [result]);

  const estimadedSendingUSD = useMemo(() => {
    const estimatedSendingFormatted = bigIntToDecimal(
      depositAmount,
      optiDecimals[tokenSelected as keyof Coins]
    );

    if (estimatedSendingFormatted !== undefined) {
      return (
        estimatedSendingFormatted * pricesCoins[tokenSelected as keyof Coins]
      );
    }
  }, [estimatedReceiving, pricesCoins, tokenSelected, depositAmount]);

  const [estimadedReceivingUSD] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(0.1);

  const listFrom = useMemo(() => {
    return listCoins.filter((token: Token) => token.name !== tokenDesired);
  }, [tokenDesired]);

  const listTo = useMemo(() => {
    return listCoins.filter((token: Token) => token.name !== tokenSelected);
  }, [tokenSelected]);

  useEffect(() => {
    setDepositAmount(BigInt(0));
  }, [tokenSelected]);

  return (
    <div className="center h-[calc(100vh-64px)] flex-row  gap-6 bg-bgCardNavbar">
      <div className="card mt-8 max-h-[600px] w-[500px]  transform overflow-hidden text-left align-middle shadow-xl transition-all">
        <div className="flex flex-row items-center justify-between border-b-[0.5px] border-solid border-borderCardAbout p-6  text-lg font-medium leading-6 text-gray-900">
          Swap
        </div>
        <div className="borderBottom m-auto flex flex-col  gap-5 p-5">
          <div className="flex flex-row items-center gap-3 ">
            <div className="flex flex-col gap-2">
              <div className="text-base font-medium">
                From Wallet {isConnected && "Optismim"}
              </div>
              <ListboxComponent
                width={224}
                list={listFrom}
                fromListBox={true}
              />
              <div className="text-xs font-medium text-textGray">
                {` Balances :  ${
                  displayBalance(
                    balanceCoins[tokenSelected as keyof Coins],
                    optiDecimals[tokenSelected as keyof Coins]
                  ) +
                  " " +
                  tokenSelected
                }`}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className=" text-base font-medium">Amount</div>
              <div className="flex h-[40px] w-[224px]  items-center justify-between rounded-xl border-[0.5px] border-solid border-borderCardAbout p-2">
                <input
                  type="number"
                  placeholder="0,00"
                  className="w-[224px"
                  value={displayBalance(
                    depositAmount,
                    optiDecimals[tokenSelected as keyof Coins]
                  )}
                  onChange={(event) => {
                    const newAmount = stringToBigInt(
                      event.target.value,
                      optiDecimals[tokenSelected as keyof Coins]
                    );

                    if (newAmount !== undefined) {
                      setDepositAmount(newAmount);
                    }
                  }}
                />
                <div
                  onClick={() => {
                    setDepositAmount(
                      balanceCoins[tokenSelected as keyof Coins]
                    );
                  }}
                  className="center h-[28px] w-[40px]  rounded-md bg-ethBalance px-1 py-2 text-xs font-semibold  hover:cursor-pointer"
                >
                  Max
                </div>
              </div>
              <div className="text-xs font-medium text-textGray">{`$${estimadedSendingUSD?.toFixed(
                2
              )}`}</div>
            </div>
          </div>

          <DoubleArrowWithBar
            className=" hover:cursor-pointer"
            onClick={() => {}}
          />
          <div className=" flex flex-row items-center gap-3 ">
            <div className="flex flex-col gap-2">
              <div className="text-base font-medium">
                To {result.nomBlockchain}
              </div>
              <ListboxComponent width={224} list={listTo} fromListBox={false} />
            </div>

            <div className="flex flex-col gap-2 ">
              <div className="pb-4 text-base font-medium">You will receive</div>
              <input
                type="number"
                placeholder="0,00"
                value={estimatedReceiving.toFixed(4)}
                disabled
                className="flex h-[40px] w-[224px]  items-center justify-between rounded-xl border-[0.5px] border-solid border-borderCardAbout p-[10px]"
              />
              <div className="text-xs font-medium text-textGray">{`$${estimadedReceivingUSD?.toFixed(
                2
              )}`}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col  gap-2   p-5">
          <div className="  text-lg  font-medium  ">
            Swap Slippage : {slippage} %
          </div>
          <div className="flex flex-row gap-2">
            <div
              onClick={() => {
                setSlippage(0.1);
              }}
              className="center h-[35px] w-[45px] rounded-md bg-ethBalance px-1 py-2 text-sm font-semibold  hover:cursor-pointer"
            >
              0.1%
            </div>
            <div
              onClick={() => {
                setSlippage(0.5);
              }}
              className="center h-[35px] w-[45px] rounded-md bg-ethBalance px-1 py-2 text-sm font-semibold  hover:cursor-pointer"
            >
              0.5%
            </div>
            <div
              onClick={() => {
                setSlippage(1);
              }}
              className="center h-[35px] w-[45px] rounded-md bg-ethBalance px-1 py-2 text-sm font-semibold  hover:cursor-pointer"
            >
              1%
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <div
            className="flex h-[48px] items-center justify-center rounded-lg bg-pink p-3 text-base font-normal text-white hover:cursor-pointer"
            onClick={() => {}}
          >
            <button type="button">Approve</button>
          </div>
        </div>
      </div>

      <div className="card mt-8  flex h-[565px] w-[450px] flex-col justify-between gap-5   p-5">
        <div className=" p-3 text-xl font-extrabold">Roots</div>
        <div className=" flex  flex-col gap-3 p-5">
          <CardEstimation
            chain={"Optimism"}
            amount={coinEstimations.OPTIMISM}
            best={result.nomBlockchain === "OPTIMISM"}
          />
          <CardEstimation
            chain={"Polygon"}
            amount={coinEstimations.POLYGON}
            best={result.nomBlockchain === "POLYGON"}
          />
          <CardEstimation
            chain={"Mainnet"}
            amount={coinEstimations.MAINNET}
            best={result.nomBlockchain === "MAINNET"}
          />
          <CardEstimation
            chain={"BNBchain"}
            amount={coinEstimations.BNBCHAIN}
            best={result.nomBlockchain === "BNBCHAIN"}
          />
          <CardEstimation
            chain={"Avalanche"}
            amount={coinEstimations.AVALANCHE}
            best={result.nomBlockchain === "AVALANCHE"}
          />
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
