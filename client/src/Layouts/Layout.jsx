import React, { Suspense, useContext } from "react";
import { UserContext } from "../context/userContext";
import LoggedNavBar from "../components/general/LoggedNavBar";
import NavBar from "../components/general/NavBar";
import { LinearProgress } from "@mui/material";
import PopupDialog from "../tools/PopupDialog";
import { ClientContext } from "../context/clientContext";
import ClientNavBar from "../components/general/ClientNavBar";

function Layout({ children }) {
  const { loggedUser } = useContext(UserContext);
  const { loggedClient } = useContext(ClientContext);

  const renderLayouts = () => {
    if (loggedUser?.id) {
      return (
        <>
          <LoggedNavBar />
          <PopupDialog />
        </>
      );
    } else if (loggedClient?.id) return <ClientNavBar />;
    else return <NavBar />;
  };

  return (
    <Suspense fallback={<LinearProgress />}>
      {renderLayouts()}
      {children}
    </Suspense>
  );
}

export default Layout;
