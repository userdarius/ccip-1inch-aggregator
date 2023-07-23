import React from "react";
import { Routes as AppRoutes, Route } from "react-router-dom";
import VaultsPage from "../pages/VaultsPage/VaultsPage";
import SwapPage from "../pages/SwapPage/SwapPage";

const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/" element={<SwapPage />} />
      <Route path="/Swap" element={<SwapPage />} />
      <Route path="/Vaults" element={<VaultsPage />} />
    </AppRoutes>
  );
};

export default Routes;
