import { Stack } from '@mui/material';
import React from 'react';
import { StyledInput, StyledWarningMessage } from '../../styles/SignUpStyles';

function InputField({
	label,
	id,
	placeholder,
	required = false,
	fieldsErrors,
	value,
	handleFieldChange,
}) {
	return (
		<Stack marginBottom='6px'>
			<label htmlFor={id}>{`${label} ${required ? '*' : ''}`}</label>
			<StyledInput
				type='text'
				id={id}
				placeholder={placeholder}
				value={value}
				onChange={(e) => {
					handleFieldChange(e.target.id, e.target.value);
				}}
			/>
			<StyledWarningMessage>{fieldsErrors[id]}</StyledWarningMessage>
		</Stack>
	);
}

export default InputField;
