import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { UserContextProvider } from "./context/userContext";
import theme from "./styles/CustomTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DialogContextProvider } from "./context/DialogContext";
import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <DialogContextProvider>
            <ToastContainer
              style={{
                width: "90%",
                left: "50%",
                transform: "translateX(-50%)",
                top: "10px",
              }}
            />
            <CssBaseline enableColorScheme />
            <App />
          </DialogContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
