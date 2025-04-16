import { LinearProgress } from '@mui/material';
import { Suspense, useContext } from 'react';
import PopupDialog from '../components/PopupDialog';
import NavBar from '../components/NavBar';
import LoggedNavBar from '../components/LoggedNavBar';
import { ChildrenProps } from '../types/ChildrenProps';
import { UserContext } from '../contexts/userContext';
import { ClientContext } from '../contexts/clientContext';
import ClientNavBar from '../components/ClientNavBar';
import { ClientContextType } from '../types/ClientContextType';
import { UserContextType } from '../types/UserContextType';

function Layout({ children }: ChildrenProps) {
  const { loggedUser } = useContext(UserContext) as UserContextType;
  const { loggedClient } = useContext(ClientContext) as ClientContextType;

  const renderLayouts = () => {
    if (loggedUser.id) {
      return (
        <>
          <LoggedNavBar />
          <PopupDialog />
        </>
      );
    } else if (loggedClient.id) return <ClientNavBar />;
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
