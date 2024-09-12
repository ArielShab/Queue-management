import { Container, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import InputField from '../components/general/InputField';
import { StyledSignUpForm, StyledSubmitInput } from '../styles/SignUpStyles';
import { createUser } from '../api/usersApi';

function SignUp() {
	const [fieldsValues, setFieldsValues] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
	});
	const [fieldsErrors, setFieldsErrors] = useState({});

	const handleFieldChange = (id, value) => {
		const temp = { ...fieldsValues };
		temp[id] = value;
		setFieldsValues(temp);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate form fields
		const errors = validate(fieldsValues);
		setFieldsErrors(errors);

		// If there are validation errors, stop the submission
		if (Object.keys(errors).length) return;

		try {
			const response = await createUser(fieldsValues);

			console.log('User created successfully:', response.data);
		} catch (error) {
			console.error('Error creating user:', error);
		}
	};

	const validate = (values) => {
		const errors = {};
		const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
		const phoneRegex = /^0\d{8,9}$/;

		if (!values.firstName) {
			errors.firstName = 'First name is required';
		}
		if (!values.lastName) {
			errors.lastName = 'Last name is required';
		}
		if (!values.email) {
			errors.email = 'Email is required';
		} else if (!emailRegex.test(values.email)) {
			errors.email = 'Invalid email';
		}
		if (!values.phone) {
			errors.phone = 'Phone number is required';
		} else if (!phoneRegex.test(values.phone)) {
			errors.phone = 'Invalid phone number';
		}
		return errors;
	};

	return (
		<Container>
			<Typography component='h1' variant='h1' marginBlock='20px'>
				Sign Up
			</Typography>
			<StyledSignUpForm onSubmit={handleSubmit}>
				<InputField
					label='First name'
					id='firstName'
					placeholder='Enter first name please'
					required={true}
					fieldsErrors={fieldsErrors}
					value={fieldsValues.firstName}
					handleFieldChange={handleFieldChange}
				/>
				<InputField
					label='Last name'
					id='lastName'
					placeholder='Enter last name please'
					required={true}
					fieldsErrors={fieldsErrors}
					value={fieldsValues.lastName}
					handleFieldChange={handleFieldChange}
				/>
				<InputField
					label='Email'
					id='email'
					placeholder='Enter email please'
					required={true}
					fieldsErrors={fieldsErrors}
					value={fieldsValues.email}
					handleFieldChange={handleFieldChange}
				/>
				<InputField
					label='Phone'
					id='phone'
					placeholder='Enter first name please'
					fieldsErrors={fieldsErrors}
					value={fieldsValues.phone}
					handleFieldChange={handleFieldChange}
				/>
				<Stack alignItems='flex-end'>
					<StyledSubmitInput type='submit' value='Register' />
				</Stack>
			</StyledSignUpForm>
		</Container>
	);
}

export default SignUp;
