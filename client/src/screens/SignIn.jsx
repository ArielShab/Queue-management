import { Container, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { StyledSignUpForm, StyledSubmitInput } from '../styles/SignUpStyles';
import InputField from '../components/general/InputField';

function SignIn() {
	const [email, setEmail] = useState('');
	const [fieldsErrors, setFieldsErrors] = useState({});

	const handleFieldChange = (id, value) => {
		setEmail(value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
		const errors = {};

		if (!email) {
			errors.email = 'Email is required';
		} else if (!emailRegex.test(email)) {
			errors.email = 'Email Invalid email';
		}
		setFieldsErrors(errors);
	};

	return (
		<Container>
			<Typography component='h1' variant='h1' marginBlock='20px'>
				Sign in
			</Typography>
			<StyledSignUpForm onSubmit={handleSubmit}>
				<InputField
					label='Email'
					id='email'
					placeholder='Enter email please'
					required={true}
					fieldsErrors={fieldsErrors}
					value={email}
					handleFieldChange={handleFieldChange}
				/>
				<Stack alignItems='flex-end'>
					<StyledSubmitInput type='submit' value='Send' />
				</Stack>
			</StyledSignUpForm>
		</Container>
	);
}

export default SignIn;
