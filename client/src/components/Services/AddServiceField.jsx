import React, { useState } from 'react';
import { IconButton, Stack, TextField } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

function AddServiceField({ setIsAddService, handleAddService }) {
	const [serviceName, setServiceName] = useState('');

	return (
		<Stack
			direction='row'
			alignItems='center'
			justifyContent='space-between'
			columnGap='8px'
			width='100%'
		>
			<TextField
				id='standard-basic'
				variant='standard'
				placeholder='Name your service'
				value={serviceName}
				onChange={(e) => setServiceName(e.target.value)}
				sx={{ flexGrow: 1 }}
			/>
			<IconButton onClick={() => setIsAddService(false)}>
				<CloseIcon />
			</IconButton>
			<IconButton onClick={() => handleAddService(serviceName)}>
				<DoneIcon />
			</IconButton>
		</Stack>
	);
}

export default AddServiceField;
