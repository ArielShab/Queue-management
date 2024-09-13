import { Container, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { StyledSignUpForm, StyledSubmitInput } from '../styles/SignUpStyles';
import InputField from '../components/general/InputField';
import { loginUser, verifyCode } from '../api/usersApi';

function SignIn() {
	const [fieldsErrors, setFieldsErrors] = useState({});
	const [email, setEmail] = useState('');
	const [verificationCode, setVerificationCode] = useState('');
	const [step, setStep] = useState(1);
	const [error, setError] = useState('');
	const [timer, setTimer] = useState(300); // 5-minute timer in seconds

	const handleFieldChange = (id, value) => {
		if (id === 'email') setEmail(value);
		else if (id === 'verification-code') setVerificationCode(value);
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
			setStep(2);

			if (response.status === 200) {
				// Store the user's email in localStorage and a flag indicating they are at step 2
				localStorage.setItem('step', 'verification');
				localStorage.setItem('email', email); // Store the email
				const expiresAt = Date.now() + 5 * 60 * 1000; // Store expiration time (5 minutes)
				localStorage.setItem('codeExpiration', expiresAt);

				// Start the countdown timer
				const interval = setInterval(() => {
					setTimer((prev) => {
						if (prev <= 1) clearInterval(interval);
						return prev - 1;
					});
				}, 1000);
			} else {
				console.log('response', response);
			}
		} catch (error) {
			setError('Invalid email or password');
		}
	};

	const handleVerifyCode = async (e) => {
		e.preventDefault();

		try {
			const response = await verifyCode({
				email,
				code: verificationCode,
			});
			const { token, user } = response.data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.removeItem('step');
			localStorage.removeItem('email');
			localStorage.removeItem('codeExpiration');

			alert('login succesful');

			// Redirect to the logged-in area (dashboard, etc.)
		} catch (err) {
			setError('Invalid or expired code');
		}
	};

	useEffect(() => {
		// Check if the user is supposed to be on the verification code page
		const step = localStorage.getItem('step');
		const expiration = localStorage.getItem('codeExpiration');

		if (step !== 'verification' || !expiration) {
			// If not, redirect to step 1 (login page)
			return;
		}

		const currentTime = Date.now();

		if (currentTime > parseInt(expiration)) {
			// Code has expired, redirect back to step 1
			localStorage.removeItem('step');
			localStorage.removeItem('email');
			localStorage.removeItem('codeExpiration');
			return;
		} else {
			setStep(2);
		}

		const remainingTime = Math.floor((expiration - currentTime) / 1000);
		setTimer(remainingTime);

		const interval = setInterval(() => {
			setTimer((prev) => {
				if (prev <= 1) clearInterval(interval);
				return prev - 1;
			});
		}, 1000);
	}, []);

	return (
		<Container>
			{step === 1 ? (
				<>
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
				</>
			) : (
				<>
					<Typography component='h1' variant='h1' marginBlock='20px'>
						Set verification code
					</Typography>
					<StyledSignUpForm onSubmit={handleVerifyCode}>
						<InputField
							label='Verification Code'
							id='verification-code'
							placeholder='Verification Code'
							required={true}
							fieldsErrors={fieldsErrors}
							value={verificationCode}
							handleFieldChange={handleFieldChange}
						/>
						<Stack alignItems='flex-end'>
							<StyledSubmitInput type='submit' value='Verify' />
						</Stack>

						{timer > 0 ? (
							<Typography>
								Time remaining: {Math.floor(timer / 60)}:
								{(timer % 60).toString().padStart(2, '0')}
							</Typography>
						) : (
							<Typography>Code expired</Typography>
						)}
						{error && <p>{error}</p>}
					</StyledSignUpForm>
				</>
			)}
		</Container>
	);
}

export default SignIn;
