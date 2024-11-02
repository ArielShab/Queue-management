import axios from 'axios';
import { BASE_URL } from './index';

export const fetchUserQueues = async ({ queryKey }) => {
	return await axios.get(
		`${BASE_URL}/queues?userId=${queryKey[1].providerId}&day=${queryKey[1].selectedDay}`,
	);
};
