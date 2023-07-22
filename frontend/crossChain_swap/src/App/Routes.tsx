import React from "react";
import { Routes as AppRoutes, Route } from "react-router-dom";
import TemplatePage from "../pages/TemplatePage/TemplatePage";

const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/" element={<TemplatePage />} />
    </AppRoutes>
  );
};

export default Routes;
