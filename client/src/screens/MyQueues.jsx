import { Box, Container, Stack, Tab, Tabs } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import MainTitle from '../components/general/MainTitle';
import InputField from '../components/general/InputField';
import { StyledSignUpForm, StyledSubmitInput } from '../styles/SignUpStyles';

function MyQueues() {
	const [queuesToView, setQueuesToView] = useState(0);
	const queryClient = useQueryClient();
	const [fieldsErrors, setFieldsErrors] = useState({});
	const [email, setEmail] = useState('');
	const [verificationCode, setVerificationCode] = useState('');

	// const { data: queues } = useQuery({
	// 	queryKey: ['queues', loggedUser.id],
	// 	queryFn: fetchUserBookedQueues,
	// 	onError: (error) => {
	// 		console.log('Could not get queues', error);
	// 	},
	// });

	// const deleteQueueMutation = useMutation({
	// 	mutationFn: deleteBookedQueue,
	// 	onSuccess: (data) => {
	// 		if (data?.id) {
	// 			queryClient.invalidateQueries(['queues'], { exact: true });
	// 			alert('Queue was deleted');
	// 		}
	// 	},
	// 	onError: (error) => {
	// 		console.log('error', error);
	// 	},
	// });

	// const handleDeleteQueue = (id) => {
	// 	deleteQueueMutation.mutate(id);
	// };

	// const fetchClientQueuesMutation = useMutation({
	// 	mutationFn: fetchClientQueues,
	// 	onSuccess: () => {
	// 		setStep(2);
	// 		// Store the user's email in localStorage and a flag indicating they are at step 2
	// 		localStorage.setItem('step', 'verification');
	// 		localStorage.setItem('email', email); // Store the email
	// 		const expiresAt = Date.now() + 5 * 60 * 1000; // Store expiration time (5 minutes)
	// 		localStorage.setItem('codeExpiration', expiresAt);
	// 		// Start the countdown timer
	// 		const interval = setInterval(() => {
	// 			setTimer((prev) => {
	// 				if (prev <= 1) clearInterval(interval);
	// 				return prev - 1;
	// 			});
	// 		}, 1000);
	// 	},
	// 	onError: (error, body, context) => {
	// 		setError('Invalid email or password');
	// 		console.error('Invalid email or password', error);
	// 	},
	// });

	const handleSubmit = async (e) => {
		e.preventDefault();

		const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
		const errors = {};

		if (!email) {
			errors.email = 'Email is required';
		} else if (!emailRegex.test(email)) {
			errors.email = 'Invalid email';
		}
		setFieldsErrors(errors);

		// If there are validation errors, stop the submission
		if (Object.keys(errors).length) return;
		// loginUserMutation.mutate({ email });
	};

	const handleFieldChange = (id, value) => {
		if (id === 'email') setEmail(value);
		else if (id === 'verification-code') setVerificationCode(value);
	};

	const handleChange = (event, newQueueToView) => {
		setQueuesToView(newQueueToView);
	};

	// const renderFutureQueues = () => {
	// 	if (queues?.data.futureQueues.length) {
	// 		return queues?.data.futureQueues.map((queue, index) => {
	// 			return (
	// 				<BookedQueue
	// 					key={queue.id}
	// 					queue={queue}
	// 					index={index}
	// 					handleDeleteQueue={handleDeleteQueue}
	// 				/>
	// 			);
	// 		});
	// 	} else return <Typography variant='h3'>No future queues</Typography>;
	// };
	// const renderPastQueues = () => {
	// 	if (queues?.data.pastQueues.length) {
	// 		return queues?.data.pastQueues.map((queue, index) => {
	// 			return (
	// 				<BookedQueue
	// 					key={queue.id}
	// 					queue={queue}
	// 					index={index}
	// 					handleDeleteQueue={handleDeleteQueue}
	// 				/>
	// 			);
	// 		});
	// 	} else return <Typography variant='h3'>No past queues</Typography>;
	// };

	return (
		<Container>
			<MainTitle title='My queues' />

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

			<Box sx={{ borderColor: 'divider' }}>
				<Tabs
					value={queuesToView}
					onChange={handleChange}
					aria-label='basic tabs example'
				>
					<Tab label='Future queues' />
					<Tab label='Past queues' />
				</Tabs>
			</Box>

			<Stack marginTop='24px' rowGap='16px'>
				{/* {queuesToView === 0 ? renderFutureQueues() : renderPastQueues()} */}
			</Stack>
		</Container>
	);
}

export default MyQueues;
