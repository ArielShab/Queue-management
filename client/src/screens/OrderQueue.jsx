import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import MainTitle from '../components/general/MainTitle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	fetchUserQueuesTimes,
	sendClientVerificationCode,
	sendClientQueueData,
} from '../api/queuesApi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { StyledLoader } from '../styles/LoaderStyle';
import { getUserServices } from '../api/servicesApi';
import { getUserPersonalData } from '../api/usersApi';
import EmailPopup from '../components/orderQueue/EmailPopup';
import { days } from '../tools/WeekDays';

dayjs.extend(utc);
dayjs.extend(timezone);

function OrderQueue() {
	const { id: providerId } = useParams();
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState('');
	const [formattingTime, setFormattingTime] = useState('');
	const [selectedService, setSelectedService] = useState('');
	const [selectedDayName, setSelectedDayName] = useState('');
	const [openEmailVerification, setOpenEmailVerification] = useState(false);
	const [emailVerificationStep, setEmailVerificationStep] = useState(true);
	const [timer, setTimer] = useState(300);

	const { data: allQueues } = useQuery({
		queryKey: [
			'queues',
			{
				providerId,
				selectedDayName,
				selectedDate: dayjs(selectedDate).format('DD/MM/YYYY'),
			},
		],
		queryFn: fetchUserQueuesTimes,
		enabled: selectedDate !== null,
		onError: (error) => {
			console.log(error);
		},
	});

	const { data: user } = useQuery({
		queryKey: ['user', providerId],
		queryFn: getUserPersonalData,
		onError: (error) => {
			console.log("Couldn't get user data", error);
		},
	});

	const {
		data: services,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['services', providerId],
		queryFn: getUserServices,
		onError: (error) => {
			console.log(error);
		},
	});

	const sendClientQueueMutation = useMutation({
		mutationFn: sendClientQueueData,
		onSuccess: (data) => {
			setEmailVerificationStep(false);
			const interval = setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) clearInterval(interval);
					return prev - 1;
				});
			}, 1000);
		},
		onError: (error) => {
			console.error('error', error);
		},
	});

	const sendVerificationCodeMutation = useMutation({
		mutationFn: sendClientVerificationCode,
		onSuccess: (data) => {
			if (data.success) {
				setOpenEmailVerification(false);
				alert(data.data);
			}
		},
		onError: (error) => {
			console.error('error', error);
		},
	});

	const handleSendEmailVerification = (data) => {
		const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;

		if (!data.clientName) {
			alert('Full name is required');
			return;
		} else if (data.clientName.length < 2) {
			alert('Invalid full name');
			return;
		}
		if (!data.clientEmail) {
			alert('Email is required');
			return;
		} else if (!emailRegex.test(data.clientEmail)) {
			alert('Invalid email');
			return;
		}

		sendClientQueueMutation.mutate({
			...data,
			queueTime: formattingTime,
			serviceId: selectedService,
			userId: +providerId,
		});
	};

	const handleSendVerificationCode = (code) => {
		sendVerificationCodeMutation.mutate({
			queueTime: formattingTime,
			userId: +providerId,
			verificationCode: code,
		});
	};

	const handleChangeDate = (e) => {
		if (!dayjs(e.$d).isBefore(dayjs())) {
			const localDate = dayjs(e.$d).startOf('day'); // Ensures time is midnight local
			const isoString = localDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // Custom ISO format with local timezone
			setSelectedDate(isoString);
			setSelectedDayName(days[e.day()]);
		} else {
			alert('Please choose a valid date');
		}
	};

	useEffect(() => {
		if (selectedTime) {
			const [hour, minute] = selectedTime.trim().split(':').map(Number);
			const tempFormattingTime = dayjs(selectedDate)
				.hour(hour)
				.minute(minute)
				.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

			setFormattingTime(tempFormattingTime);
		}
	}, [selectedTime]);

	if (isLoading) return <StyledLoader />;
	if (isError) return <p>{JSON.stringify(error)}</p>;

	return (
		<Container>
			<MainTitle title='Book queue' />

			<Box marginBottom='20px'>
				<Typography marginBottom='8px' fontWeight='600'>
					{`Provider: ${user?.data.firstName} ${user?.data.lastName}`}
				</Typography>
				<Typography marginBottom='8px' fontWeight='600'>
					{`Eamil: ${user?.data.email}`}
				</Typography>
				<Typography fontWeight='600'>{`Phone: ${user?.data.phone}`}</Typography>
			</Box>

			<Typography>Choose date:</Typography>

			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateCalendar onChange={(e) => handleChangeDate(e)} />
			</LocalizationProvider>
			{allQueues?.data.length && (
				<>
					<Typography component='h3' variant='h3' marginBottom='16px'>
						{`Date: ${dayjs(selectedDate).format('DD/MM/YYYY')}`}
					</Typography>

					<Typography>Choose time:</Typography>

					<FormControl
						variant='standard'
						sx={{ minWidth: 120, width: '100%', mb: 3 }}
					>
						<InputLabel id='time'>Time</InputLabel>
						<Select
							labelId='time'
							id='time'
							name='time'
							value={selectedTime}
							onChange={(e) => {
								setSelectedTime(e.target.value);
							}}
							label='Choose time'
						>
							{allQueues?.data.map((queue) => {
								return (
									<MenuItem key={queue} value={queue}>
										{queue}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>

					<Typography>Choose service:</Typography>

					<FormControl
						variant='standard'
						sx={{ minWidth: 120, width: '100%' }}
					>
						<InputLabel id='service'>Service</InputLabel>
						<Select
							labelId='service'
							id='service'
							name='service'
							value={selectedService}
							onChange={(e) => {
								setSelectedService(e.target.value);
							}}
							label='Choose service'
						>
							{services?.data.map((service) => {
								return (
									<MenuItem
										key={service.id}
										value={service.id}
									>
										{service.serviceName}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>

					<Box textAlign='end' marginBottom='30px'>
						<Button
							variant='contained'
							onClick={() => setOpenEmailVerification(true)}
							sx={{ mt: 3 }}
						>
							Book queue
						</Button>
					</Box>
				</>
			)}
			<EmailPopup
				open={openEmailVerification}
				setOpen={setOpenEmailVerification}
				step={emailVerificationStep}
				handleSendEmailVerification={handleSendEmailVerification}
				handleSendVerificationCode={handleSendVerificationCode}
				timer={timer}
			/>
		</Container>
	);
}

export default OrderQueue;
