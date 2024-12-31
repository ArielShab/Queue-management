import React, { createContext, useState } from 'react';

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
	const [loggedUser, setLoggedUser] = useState(undefined);

	const UserContextData = {
		loggedUser,
		setLoggedUser,
	};

	return (
		<UserContext.Provider value={UserContextData}>
			{children}
		</UserContext.Provider>
	);
};
