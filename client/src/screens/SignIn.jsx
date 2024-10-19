import React, { useContext, useEffect, useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import { StyledSignUpForm, StyledSubmitInput } from '../styles/SignUpStyles';
import InputField from '../components/general/InputField';
import { loginUser, verifyCode } from '../api/usersApi';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import MainTitle from '../components/general/MainTitle';

function SignIn() {
	const [fieldsErrors, setFieldsErrors] = useState({});
	const [email, setEmail] = useState('');
	const [verificationCode, setVerificationCode] = useState('');
	const [step, setStep] = useState(1);
	const [error, setError] = useState('');
	const [timer, setTimer] = useState(300); // 5-minute timer in seconds
	const { setLoggedUser } = useContext(UserContext);
	const navigate = useNavigate();

	const loginUserMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: (data, body, context) => {
			setStep(2);
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
		},
		onError: (error, body, context) => {
			setError('Invalid email or password');
			console.error('Invalid email or password', error);
		},
	});

	const verifyCodeMutation = useMutation({
		mutationFn: verifyCode,
		onSuccess: (data, body, context) => {
			const token = data.data;

			localStorage.removeItem('step');
			localStorage.removeItem('email');
			localStorage.removeItem('codeExpiration');
			localStorage.setItem('token', token);

			setLoggedUser(jwtDecode(token));

			alert('login succesful');

			// Redirect to the logged-in area (dashboard, etc.)
			navigate('/');
		},
		onError: (error, body, context) => {
			setError('Invalid or expired code');
			console.error('Invalid or expired code', error);
		},
	});

	const resendCodeMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: (data, body, context) => {
			const expiresAt = Date.now() + 5 * 60 * 1000; // Store expiration time (5 minutes)
			localStorage.setItem('codeExpiration', expiresAt);
			setTimer(300);
			setError('');

			// Start the countdown timer
			const interval = setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) clearInterval(interval);
					return prev - 1;
				});
			}, 1000);
		},
		onError: (error, body, context) => {
			setError('Invalid email or password');
			console.error('Invalid email or password', error);
		},
	});

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
		loginUserMutation.mutate({ email });
	};

	const handleVerifyCode = async (e) => {
		e.preventDefault();

		verifyCodeMutation.mutate({ email, code: verificationCode });
	};

	const resendCode = async () => {
		resendCodeMutation.mutate({ email });
	};

	useEffect(() => {
		// Check if user if logged in
		const token = localStorage.getItem('token');

		if (token) {
			const decodedToken = jwtDecode(token);
			if (decodedToken.id) {
				setLoggedUser(decodedToken);
				navigate('/');
			}
		}

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
			setEmail(localStorage.getItem('email'));
		}

		const remainingTime = Math.floor((expiration - currentTime) / 1000);
		setTimer(remainingTime);

		const interval = setInterval(() => {
			setTimer((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		// Cleanup interval when component unmounts or re-renders
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<Container>
			{step === 1 ? (
				<>
					<MainTitle title='Sign in' />
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
							<>
								<Typography>Code expired</Typography>
								<button onClick={resendCode}>
									Resend Code
								</button>
							</>
						)}
						{error && <p>{error}</p>}
					</StyledSignUpForm>
				</>
			)}
		</Container>
	);
}

export default SignIn;
