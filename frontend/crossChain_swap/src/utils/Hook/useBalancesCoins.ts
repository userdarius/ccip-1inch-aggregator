import { erc20ABI, useAccount, useContractReads } from "wagmi";
import { useState } from "react";
import { BalanceCoins } from "../types/swap.types";
import { optiAddresses } from "../constants/optimism/opti.addresses";

const useBalancesCoins = () => {
  const { address, isConnected } = useAccount();
  const [balanceCoins, setBalanceCoins] = useState<BalanceCoins>({
    DAI: BigInt(0),
    USDC: BigInt(0),
    ETH: BigInt(0),
    BTC: BigInt(0),
  });

  useContractReads({
    contracts: [
      {
        address: optiAddresses.addressUSDC as `0x${string}`,
        abi: erc20ABI as any,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        address: optiAddresses.addressDai as `0x${string}`,
        abi: erc20ABI as any,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        address: optiAddresses.addresswETH as `0x${string}`,
        abi: erc20ABI as any,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        address: optiAddresses.addresswBTC as `0x${string}`,
        abi: erc20ABI as any,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
    ],
    onSuccess(data: any) {
      setBalanceCoins({
        USDC: data[0].result,
        DAI: data[1].result,
        ETH: data[2].result,
        BTC: data[3].result,
      });
    },
    enabled: isConnected,
    watch: true,
  });

  return {
    balanceCoins,
  };
};

export default useBalancesCoins;
