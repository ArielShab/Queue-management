import { BASE_URL, fetchGet } from './index';

export const fetchUserQueues = async ({ queryKey }) => {
	return await fetchGet(
		`${BASE_URL}/queues?userId=${queryKey[1].providerId}&day=${queryKey[1].selectedDay}`,
	);
};
