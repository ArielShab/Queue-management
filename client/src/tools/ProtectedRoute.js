import { useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

function ProtectedRoute({ children }) {
	const { setLoggedUser } = useContext(UserContext);
	const navigate = useNavigate();

	const handleVerifyToken = async () => {
		const token = localStorage.getItem('token');

		if (!token) navigate('/sign-in');
		else {
			const decodedToken = jwtDecode(token);
			if (!decodedToken.id) navigate('/sign-in');

			setLoggedUser(decodedToken);
		}
	};

	useEffect(() => {
		handleVerifyToken();
	}, []);

	return children;
}

export default ProtectedRoute;
