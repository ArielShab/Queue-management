import React, { useState } from 'react';
import { Container } from '@mui/material';
import MainTitle from '../components/general/MainTitle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserQueues } from '../api/queuesApi';

function OrderQueue() {
	const { id: providerId } = useParams();
	const [selectedDate, setSelectedDate] = useState(null);

	const useQueryQueues = useQuery({
		queryKey: ['queues', { providerId, selectedDate }],
		queryFn: fetchUserQueues,
		enabled: selectedDate !== null,
		onError: (error, body, context) => {
			console.log(error);
		},
	});

	return (
		<Container>
			<MainTitle title='Choose Date' />

			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateCalendar
					onChange={(e) => setSelectedDate(e.$d.toISOString())}
				/>
			</LocalizationProvider>
		</Container>
	);
}

export default OrderQueue;
