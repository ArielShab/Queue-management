import React, { useState } from 'react';
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

function DataField({
	label,
	value,
	type = 'text',
	dataKey,
	handleUpdateField,
}) {
	const [fieldValue, setFieldValue] = useState(value);
	const [isEdit, setIsEdit] = useState(false);

	const handleChangeField = () => {
		if (fieldValue !== value) {
			handleUpdateField({
				[dataKey]:
					dataKey === 'queueDuration' ? +fieldValue : fieldValue,
			});

			setIsEdit(false);
		} else {
			setIsEdit(false);
		}
	};

	return (
		<Stack direction='row' columnGap='8px' alignItems='center'>
			<Typography whiteSpace='nowrap'>{label}</Typography>
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
						type={type}
						onChange={(e) => setFieldValue(e.target.value)}
						sx={{ flexGrow: 1 }}
					/>
					<IconButton
						onClick={() => {
							setIsEdit(false);
							setFieldValue(value);
						}}
					>
						<CloseIcon />
					</IconButton>
					<IconButton onClick={handleChangeField}>
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
					<Typography>{value}</Typography>
					<IconButton onClick={() => setIsEdit(true)}>
						<EditIcon />
					</IconButton>
				</Stack>
			)}
		</Stack>
	);
}

export default DataField;
