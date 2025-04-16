import { createContext, useEffect, useState } from 'react';
import { ClientContextType } from '../types/ClientContextType';
import { ChildrenProps } from '../types/ChildrenProps';
import { ClientType } from '../types/ClientType';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../types/CustomJwtPayload';

export const ClientContext = createContext<ClientContextType | null>(null);

export const ClientContextProvider = ({ children }: ChildrenProps) => {
  const [loggedClient, setLoggedClient] = useState<ClientType>({
    id: '',
    email: '',
  });
  const [isClientAuthenticated, setIsClientAuthenticated] =
    useState<boolean>(false);

  const ClientContextData = {
    loggedClient,
    setLoggedClient,
    isClientAuthenticated,
    setIsClientAuthenticated,
  };

  useEffect(() => {
    let clientToken = localStorage.getItem('clientToken');

    if (!clientToken) {
      setLoggedClient({ id: '', email: '' });
      setIsClientAuthenticated(false);
    } else {
      const decodedToken = jwtDecode<CustomJwtPayload>(clientToken);
      setLoggedClient(decodedToken);
      setIsClientAuthenticated(true);
    }
  }, []);

  return (
    <ClientContext.Provider value={ClientContextData}>
      {children}
    </ClientContext.Provider>
  );
};
