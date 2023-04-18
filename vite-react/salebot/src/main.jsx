import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../src/assets/css/global.css";
import Wrapper from "./pages/wrapper";
import Provider from "./store/provider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <Provider>
      <BrowserRouter>
        <Wrapper />
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);
