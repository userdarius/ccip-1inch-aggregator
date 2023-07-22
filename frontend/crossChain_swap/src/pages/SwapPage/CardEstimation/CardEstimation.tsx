import React, { useContext } from "react";
import { SwapContext } from "../../../context/Swap.context";
import { Coins } from "../../../utils/types/global.types";
import { ApiContext } from "../../../context/Api.context";

type CardEstimationProps = {
  chain: string;
  amount: number;
  best?: boolean;
};

const CardEstimation = ({ chain, amount, best }: CardEstimationProps) => {
  const { pricesCoins } = useContext(SwapContext);
  const { tokenDesired } = useContext(ApiContext);

  return (
    <div
      className={` flex cursor-pointer flex-row justify-between  rounded-xl bg-gray-100 px-7 py-4 hover:bg-gray-300 ${
        best ? "bg-gray-300" : "bg-gray-100"
      }`}
    >
      <div className="center flex flex-row gap-3">
        <div>
          <span className="text-xl ">
            {amount.toFixed(4)} {tokenDesired}
          </span>
          <div className="text-xs font-medium text-textGray">
            ${(amount * pricesCoins[tokenDesired as keyof Coins]).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="center flex flex-row  gap-5  text-xl">
        <div>on {chain}</div>
      </div>
    </div>
  );
};

export default CardEstimation;
