import { IconButton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

function ServiceField({ serviceName }) {
	const [fieldValue, setFieldValue] = useState(serviceName);
	const [isEdit, setIsEdit] = useState(false);

	return (
		<Stack direction='row' columnGap='8px' alignItems='center'>
			{isEdit ? (
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
						value={fieldValue}
						onChange={(e) => setFieldValue(e.target.value)}
						sx={{ flexGrow: 1 }}
					/>
					<IconButton
						onClick={() => {
							setFieldValue(serviceName);
							setIsEdit(false);
						}}
					>
						<CloseIcon />
					</IconButton>
					<IconButton /*onClick={handleChangeField}*/>
						<DoneIcon />
					</IconButton>
				</Stack>
			) : (
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					width='100%'
				>
					<Typography flexGrow='1'>{fieldValue}</Typography>
					<IconButton onClick={() => setIsEdit(true)}>
						<EditIcon />
					</IconButton>
					<IconButton>
						<DeleteIcon />
					</IconButton>
				</Stack>
			)}
		</Stack>
	);
}

export default ServiceField;
