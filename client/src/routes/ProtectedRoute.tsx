import { ReactNode, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { ClientContext } from '../contexts/clientContext';
import { UserContextType } from '../types/UserContextType';
import { ClientContextType } from '../types/ClientContextType';

function ProtectedRoute({
  isClient = false,
  children,
}: {
  isClient?: boolean;
  children: ReactNode;
}) {
  const { isUserAuthenticated, setLoggedUser } = useContext(
    UserContext,
  ) as UserContextType;
  const { isClientAuthenticated, setLoggedClient } = useContext(
    ClientContext,
  ) as ClientContextType;
  const navigate = useNavigate();
  const location = useLocation();

  const verifyUserAuthentication = async () => {
    if (!isUserAuthenticated) {
      setLoggedUser({ id: '', email: '' });
      navigate('/sign-in', {
        state: {
          pathname: location.pathname,
          search: location.search,
        },
      });
    }
  };

  const verifyClientAuthentication = async () => {
    if (!isClientAuthenticated) {
      setLoggedClient({ id: '', email: '' });
      navigate('/sign-in', {
        state: {
          pathname: location.pathname,
          search: location.search,
        },
      });
    }
  };

  useEffect(() => {
    if (isClient) verifyClientAuthentication();
    else verifyUserAuthentication();
  }, [isUserAuthenticated, isClientAuthenticated]);

  return <>{children}</>;
}

export default ProtectedRoute;
