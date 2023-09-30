import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/AuthContextProvider";
import { UsersContextProvider } from "./contexts/UsersContextProvider";
import { ClickedUserContextProvider } from "./contexts/ClickedUserContextProvider";
import { OpenSettingsModalContextProvider } from "./contexts/OpenSettingsModalContextProvider";
import { OpenProfileContextProvider } from "./contexts/OpenProfileContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <UsersContextProvider>
      <ClickedUserContextProvider>
        <OpenProfileContextProvider>
          <OpenSettingsModalContextProvider>
            <App />
          </OpenSettingsModalContextProvider>
        </OpenProfileContextProvider>
      </ClickedUserContextProvider>
    </UsersContextProvider>
  </AuthContextProvider>
);
