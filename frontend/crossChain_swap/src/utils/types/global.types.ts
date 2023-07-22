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
