import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

function SignOut() {
	const navigate = useNavigate();
	const { setLoggedUser } = useContext(UserContext);

	useEffect(() => {
		localStorage.removeItem('token');
		setLoggedUser(null);
		navigate('/sign-in');
	}, []);
}

export default SignOut;
