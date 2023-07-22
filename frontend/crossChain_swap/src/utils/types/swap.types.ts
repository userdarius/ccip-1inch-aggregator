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

export type Quote = {
  fromToken: {
    symbol: "string";
    name: "string";
    address: "string";
    decimals: 0;
    logoURI: "string";
  };
  toToken: {
    symbol: "string";
    name: "string";
    address: "string";
    decimals: 0;
    logoURI: "string";
  };
  toAmount: "string";
  protocols: [
    {
      name: "string";
      part: 0;
      fromTokenAddress: "string";
      toTokenAddress: "string";
    }
  ];
  gas: 0;
};
