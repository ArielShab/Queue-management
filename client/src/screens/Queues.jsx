import React, { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Container, Stack } from '@mui/material';
import MainTitle from '../components/general/MainTitle';
import { UserContext } from '../context/userContext';
import { deleteBookedQueue, fetchUserBookedQueues } from '../api/queuesApi';
import BookedQueue from '../components/queues/BookedQueue';

function Queues() {
	const { loggedUser } = useContext(UserContext);
	const queryClient = useQueryClient();

	const { data: queues } = useQuery({
		queryKey: ['queues', loggedUser.id],
		queryFn: fetchUserBookedQueues,
		onError: (error) => {
			console.log('Could not get queues', error);
		},
	});

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

	return (
		<Container>
			<MainTitle title='Future queues' />

			<Stack rowGap='16px'>
				{queues?.data.map((queue, index) => {
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
