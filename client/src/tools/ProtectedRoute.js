import { useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { ClientContext } from "../context/clientContext";

function ProtectedRoute({ children }) {
  const { setLoggedUser } = useContext(UserContext);
  const { setLoggedClient } = useContext(ClientContext);
  const navigate = useNavigate();

  const handleVerifyToken = async () => {
    const userToken = localStorage.getItem("token");
    const clientToken = localStorage.getItem("clientToken");

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      if (!decodedToken.id) navigate("/sign-in");

      setLoggedUser(decodedToken);
      navigate("/");
    } else if (clientToken) {
      const decodedToken = jwtDecode(clientToken);
      if (!decodedToken.id) navigate("/my-queues");

      setLoggedClient(decodedToken);
      navigate("/my-queues");
    } else navigate("/sign-in");
  };

  useEffect(() => {
    handleVerifyToken();
  }, []);

  return children;
}

export default ProtectedRoute;
