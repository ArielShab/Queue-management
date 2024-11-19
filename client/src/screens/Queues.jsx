import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Container, Stack, Tab, Tabs } from '@mui/material';
import MainTitle from '../components/general/MainTitle';
import { UserContext } from '../context/userContext';
import { deleteBookedQueue, fetchUserBookedQueues } from '../api/queuesApi';
import BookedQueue from '../components/queues/BookedQueue';

function Queues() {
	const [queuesToView, setQueuesToView] = useState(0);
	const { loggedUser } = useContext(UserContext);
	const queryClient = useQueryClient();

	const { data: queues } = useQuery({
		queryKey: ['queues', loggedUser.id],
		queryFn: fetchUserBookedQueues,
		onError: (error) => {
			console.log('Could not get queues', error);
		},
	});

	console.log('queues', queues);

	const deleteQueueMutation = useMutation({
		mutationFn: deleteBookedQueue,
		onSuccess: (data) => {
			if (data?.id) {
				queryClient.invalidateQueries(['queues'], { exact: true });
				alert('Queue was deleted');
			}
		},
		onError: (error) => {
			console.log('error', error);
		},
	});

	const handleDeleteQueue = (id) => {
		deleteQueueMutation.mutate(id);
	};

	const handleChange = (event, newQueueToView) => {
		setQueuesToView(newQueueToView);
	};

	console.log('queuesToView', queuesToView);

	return (
		<Container>
			<MainTitle title='Booked queues' />

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
				{queuesToView === 0
					? queues?.data.futureQueues.map((queue, index) => {
							return (
								<BookedQueue
									key={queue.id}
									queue={queue}
									index={index}
									handleDeleteQueue={handleDeleteQueue}
								/>
							);
					  })
					: queues?.data.pastQueues.map((queue, index) => {
							return (
								<BookedQueue
									key={queue.id}
									queue={queue}
									index={index}
									handleDeleteQueue={handleDeleteQueue}
								/>
							);
					  })}
			</Stack>
		</Container>
	);
}

export default Queues;
