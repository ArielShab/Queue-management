import React, { Suspense, useContext } from "react";
import { UserContext } from "../context/userContext";
import LoggedNavBar from "../components/general/LoggedNavBar";
import NavBar from "../components/general/NavBar";
import { LinearProgress } from "@mui/material";
import PopupDialog from "../tools/PopupDialog";

function Layout({ children }) {
  const { loggedUser } = useContext(UserContext);

  return (
    <Suspense fallback={<LinearProgress />}>
      {loggedUser?.id ? (
        <>
          <LoggedNavBar />
          <PopupDialog />
        </>
      ) : (
        <NavBar />
      )}
      {children}
    </Suspense>
  );
}

export default Layout;
