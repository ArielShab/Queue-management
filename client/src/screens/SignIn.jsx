import { Container, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { StyledSignUpForm, StyledSubmitInput } from '../styles/SignUpStyles';
import InputField from '../components/general/InputField';
import { loginUser } from '../api/usersApi';

function SignIn() {
	const [email, setEmail] = useState('');
	const [fieldsErrors, setFieldsErrors] = useState({});

	const handleFieldChange = (id, value) => {
		setEmail(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
		const errors = {};

		if (!email) {
			errors.email = 'Email is required';
		} else if (!emailRegex.test(email)) {
			errors.email = 'Email Invalid email';
		}
		setFieldsErrors(errors);

		// If there are validation errors, stop the submission
		if (Object.keys(errors).length) return;

		try {
			const response = await loginUser({ email: email });

			console.log('User created successfully:', response.data);
		} catch (error) {
			console.error('Error creating user:', error);
		}
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
