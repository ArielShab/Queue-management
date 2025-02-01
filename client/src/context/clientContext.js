import React, { createContext, useState } from "react";

export const ClientContext = createContext({});

export const ClientContextProvider = ({ children }) => {
  const [loggedClient, setLoggedClient] = useState(undefined);

  const ClientContextData = {
    loggedClient,
    setLoggedClient,
  };

  return (
    <ClientContext.Provider value={ClientContextData}>
      {children}
    </ClientContext.Provider>
  );
};
