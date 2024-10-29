import axios from 'axios';
import { BASE_URL } from './index';

export const fetchUserQueues = async ({ queryKey }) => {
	console.log('queryKey', queryKey);
	return await axios.get(
		`${BASE_URL}/queues?userId=${queryKey[1].providerId}&date=${queryKey[1].selectedDate}`,
	);
};
