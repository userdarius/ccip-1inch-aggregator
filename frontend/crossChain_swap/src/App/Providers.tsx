import React, { FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainProvider from "../context/Main.context";
import SwapProvider from "../context/Swap.context";
import ApiProvider from "../context/Api.context";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MainProvider>
        <SwapProvider>
          <ApiProvider>{children}</ApiProvider>
        </SwapProvider>
      </MainProvider>
    </QueryClientProvider>
  );
};

export default Providers;
