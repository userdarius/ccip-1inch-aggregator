import { FC, createContext, ReactNode, useEffect, useState } from "react";
import { Coins } from "../utils/types/global.types";

import { useAccount } from "wagmi";
import useBalancesCoins from "../utils/Hook/useBalancesCoins";
import { getPrices } from "../utils/helpers/swap.helper";
import { BalanceCoins } from "../utils/types/swap.types";

type SwapContextProps = {
  pricesCoins: Coins;
  balanceCoins: BalanceCoins;
};

type SwapProviderProps = {
  children: ReactNode;
};
export const SwapContext = createContext({} as SwapContextProps);
const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const [pricesCoins, setPricesCoins] = useState<Coins>({
    DAI: 0,
    USDC: 0,
    ETH: 0,
    BTC: 0,
  });

  const { isConnected } = useAccount();
  const { balanceCoins } = useBalancesCoins();

  useEffect(() => {
    if (isConnected) {
      getPrices().then((prices: Coins) => {
        setPricesCoins(prices);
      });
    }
  }, [isConnected]);

  return (
    <SwapContext.Provider
      value={{
        pricesCoins,
        balanceCoins,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

export default SwapProvider;
