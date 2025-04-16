import { Dispatch, SetStateAction } from 'react';
import { ClientType } from './ClientType';

export interface ClientContextType {
  loggedClient: ClientType;
  setLoggedClient: Dispatch<SetStateAction<ClientType>>;
  isClientAuthenticated: boolean;
  setIsClientAuthenticated: Dispatch<SetStateAction<boolean>>;
}
