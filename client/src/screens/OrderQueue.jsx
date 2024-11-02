import React, { useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { fetchUserQueues } from '../api/queuesApi';
import dayjs from 'dayjs';
import { StyledLoader } from '../styles/LoaderStyle';
import { getUserServices } from '../api/servicesApi';
import { getUserPersonalData } from '../api/usersApi';

function OrderQueue() {
	const { id: providerId } = useParams();
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState('');
	const [selectedService, setSelectedService] = useState('');
	const [selectedDay, setSelectedDay] = useState('');
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	const { data: allQueues } = useQuery({
		queryKey: ['queues', { providerId, selectedDay }],
		queryFn: fetchUserQueues,
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

	console.log('user', user);

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
				<DateCalendar
					onChange={(e) => {
						setSelectedDate(e.$d);
						setSelectedDay(days[e.day()]);
					}}
				/>
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
							// onClick={() => setIsAddService(true)}
							sx={{ mt: 3 }}
						>
							Book queue
						</Button>
					</Box>
				</>
			)}
		</Container>
	);
}

export default OrderQueue;
