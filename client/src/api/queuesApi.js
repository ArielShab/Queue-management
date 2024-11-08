import { BASE_URL, fetchGet, fetchPost } from './index';

export const fetchUserQueues = async ({ queryKey }) => {
	return await fetchGet(
		`${BASE_URL}/queues?userId=${queryKey[1].providerId}&day=${queryKey[1].selectedDayName}`,
	);
};

export const sendClientQueueData = async (body) => {
	return await fetchPost(`${BASE_URL}/queues/send-client-queue-data`, body);
};

export const sendClientConfirmationCode = async (code) => {
	console.log('code', code);
};
