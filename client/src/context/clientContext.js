import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ClientContext = createContext({});

export const ClientContextProvider = ({ children }) => {
  const [loggedClient, setLoggedClient] = useState(undefined);
  const navigate = useNavigate();

  const ClientContextData = {
    loggedClient,
    setLoggedClient,
  };

  // useEffect(() => {
  //   // Check if user if logged in
  //   const token = localStorage.getItem("clientToken");

  //   if (token) {
  //     const decodedToken = jwtDecode(token);

  //     if (decodedToken.id) {
  //       setLoggedClient(decodedToken);
  //     }
  //   }
  // }, []);

  return (
    <ClientContext.Provider value={ClientContextData}>
      {children}
    </ClientContext.Provider>
  );
};
