import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { fetchUserBookedQueues } from '../api/queuesApi';
import { UserContext } from '../context/userContext';

function Queues() {
	const { loggedUser } = useContext(UserContext);

	const { data: queues } = useQuery({
		queryKey: ['queues', loggedUser.id],
		queryFn: fetchUserBookedQueues,
		onError: (error) => {
			console.log('Could not get queues', error);
		},
	});

	console.log('queues', queues);

	return <div>Queues</div>;
}

export default Queues;
