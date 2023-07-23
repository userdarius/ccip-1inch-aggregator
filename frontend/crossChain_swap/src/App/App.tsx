import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Providers from "./Providers";
import Routes from "./Routes";

import Header from "../components/Header/Header";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { optimism } from "viem/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { MagicAuthConnector } from "@everipedia/wagmi-magic-connector";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimism],
  [
    alchemyProvider({ apiKey: "Qxyx5pvta-u8NGcIAPraZnCO_7z0gobZ" }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "059415c7c59640771e4272d1c7383e7f",
      },
    }),
    new MagicAuthConnector({
      options: {
        apiKey: "pk_live_A92E80BE7F60C880",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});
const App = () => {
  return (
    <WagmiConfig config={config}>
      <Providers>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Router>
          <Header />
          <Routes />
        </Router>
      </Providers>
    </WagmiConfig>
  );
};

export default App;
