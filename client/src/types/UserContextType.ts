import { Dispatch, SetStateAction } from 'react';
import { UserType } from './UserType';

export interface UserContextType {
  loggedUser: UserType;
  setLoggedUser: Dispatch<SetStateAction<UserType>>;
  isUserAuthenticated: boolean;
  setIsUserAuthenticated: Dispatch<SetStateAction<boolean>>;
}
