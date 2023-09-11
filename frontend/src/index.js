import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/AuthContextProvider";
import { UsersContextProvider } from "./contexts/UsersContextProvider";
import { ClickedUserContextProvider } from "./contexts/ClickedUserContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <UsersContextProvider>
      <ClickedUserContextProvider>
        <App />
      </ClickedUserContextProvider>
    </UsersContextProvider>
  </AuthContextProvider>
);
