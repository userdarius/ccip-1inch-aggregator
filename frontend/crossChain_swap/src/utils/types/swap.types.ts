import React from "react";

export type BalanceCoins = {
  DAI: bigint;
  USDC: bigint;
  ETH: bigint;
  BTC: bigint;
};

export type TokenSelected = "USDC" | "DAI" | "ETH" | "BTC";

export type Token = {
  name: TokenSelected;
  svgLogo: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
};
