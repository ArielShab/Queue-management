import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { ClientContext } from '../contexts/clientContext';
import { ClientContextType } from '../types/ClientContextType';
import { UserContextType } from '../types/UserContextType';

function SignOut() {
  const navigate = useNavigate();
  const { setLoggedUser, setIsUserAuthenticated } = useContext(
    UserContext,
  ) as UserContextType;
  const { setLoggedClient, setIsClientAuthenticated } = useContext(
    ClientContext,
  ) as ClientContextType;

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('clientToken');
    setLoggedUser({ id: '', email: '' });
    setIsUserAuthenticated(false);
    setLoggedClient({ id: '', email: '' });
    setIsClientAuthenticated(false);
    navigate('/sign-in');
  }, []);

  //   must return a tsx component
  return <></>;
}

export default SignOut;
