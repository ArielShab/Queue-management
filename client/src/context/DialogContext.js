import React, { createContext, useState } from 'react';

export const DialogContext = createContext({});

export const DialogContextProvider = ({ children }) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogText, setDialogText] = useState(false);
	const [dialogFunction, setDialogFunction] = useState(false);

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setDialogFunction(null); // Reset the function after use
	};

	const handleDialogText = (title) => {
		setDialogText(title);
	};

	const handleSetDialogFunction = (func) => {
		setDialogFunction(() => func);
	};

	const DialogContextData = {
		openDialog,
		dialogText,
		dialogFunction,
		handleOpenDialog,
		handleDialogText,
		handleCloseDialog,
		handleSetDialogFunction,
	};

	return (
		<DialogContext.Provider value={DialogContextData}>
			{children}
		</DialogContext.Provider>
	);
};
