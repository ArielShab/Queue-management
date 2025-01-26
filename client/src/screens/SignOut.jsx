import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { ClientContext } from "../context/clientContext";

function SignOut() {
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const { setLoggedClient } = useContext(ClientContext);

  useEffect(() => {
    if (loggedUser) {
      localStorage.removeItem("token");
      setLoggedUser(null);
      navigate("/sign-in");
    } else {
      localStorage.removeItem("clientToken");
      setLoggedClient(null);
      navigate("/my-queues");
    }
  }, []);
}

export default SignOut;
