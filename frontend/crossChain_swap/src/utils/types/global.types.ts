import { Address } from "viem";

export type MagicMetadata = {
  issuer: string;
  publicAddress: string;
  email: string;
  isMfaEnabled: boolean;
  phoneNumber: null;
  recoveryFactors: [];
  walletType: string;
};

export type Coins = {
  DAI: number;
  USDC: number;
  ETH: number;
  BTC: number;
};

export type Blockchains = {
  OPTIMISM: number;
  AVALANCHE: number;
  BNBCHAIN: number;
  MAINNET: number;
  POLYGON: number;
};

export type CoinsAddress = {
  DAI: Address;
  USDC: Address;
  ETH: Address;
  BTC: Address;
};
