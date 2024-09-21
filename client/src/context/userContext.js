import React, { createContext, useState } from 'react';

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
	const [loggedUser, setLoggedUser] = useState(null);
	const [userData, setUserData] = useState(null);

	const UserContextData = {
		loggedUser,
		setLoggedUser,
		userData,
		setUserData,
	};

	return (
		<UserContext.Provider value={UserContextData}>
			{children}
		</UserContext.Provider>
	);
};
