import React, { useState } from 'react';
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

function DataField({
	label,
	value,
	type = 'text',
	editFields,
	setEditFields,
	dataKey,
	handleUpdateField,
}) {
	const [fieldValue, setFieldValue] = useState(value);

	const handleChangeField = () => {
		if (fieldValue !== value) {
			handleUpdateField({ [dataKey]: fieldValue });
			setEditFields({
				...editFields,
				[dataKey]: false,
			});
		} else
			setEditFields({
				...editFields,
				[dataKey]: false,
			});
	};

	return (
		<Stack direction='row' columnGap='8px' alignItems='center'>
			<Typography whiteSpace='nowrap'>{label}</Typography>
			{editFields[dataKey] ? (
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
					/>
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
					<IconButton
						onClick={() =>
							setEditFields({ ...editFields, [dataKey]: true })
						}
					>
						<EditIcon />
					</IconButton>
				</Stack>
			)}
		</Stack>
	);
}

export default DataField;
