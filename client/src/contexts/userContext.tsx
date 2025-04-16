import { createContext, useEffect, useState } from 'react';
import { UserContextType } from '../types/UserContextType';
import { ChildrenProps } from '../types/ChildrenProps';
import { UserType } from '../types/UserType';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../types/CustomJwtPayload';

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({ children }: ChildrenProps) => {
  const [loggedUser, setLoggedUser] = useState<UserType>({ id: '', email: '' });
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);

  const UserContextData = {
    loggedUser,
    setLoggedUser,
    isUserAuthenticated,
    setIsUserAuthenticated,
  };

  useEffect(() => {
    let token = localStorage.getItem('token');

    if (!token) {
      setLoggedUser({ id: '', email: '' });
      setIsUserAuthenticated(false);
    } else {
      // Get user data from token
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      setLoggedUser(decodedToken);
      setIsUserAuthenticated(true);
    }
  }, []);

  return (
    <UserContext.Provider value={UserContextData}>
      {children}
    </UserContext.Provider>
  );
};
