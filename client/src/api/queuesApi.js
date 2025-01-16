import { BASE_URL, fetchDelete, fetchGet, fetchPost } from "./index";

export const fetchUserQueuesTimes = async ({ queryKey }) => {
  return await fetchGet(
    `${BASE_URL}/queues?userId=${queryKey[1].providerId}&day=${queryKey[1].selectedDayName}&date=${queryKey[1].selectedDate}`
  );
};

export const sendClientQueueData = async (body) => {
  return await fetchPost(`${BASE_URL}/queues/send-client-queue-data`, body);
};

export const sendClientVerificationCode = async (body) => {
  return await fetchPost(`${BASE_URL}/queues/verify-client-queue-code`, body);
};

export const fetchUserBookedQueues = async ({ queryKey }) => {
  return await fetchGet(
    `${BASE_URL}/queues/get-booked-queues?id=${queryKey[1]}`
  );
};

export const deleteBookedQueue = async (id) => {
  return await fetchDelete(`${BASE_URL}/queues/delete-queue-by-id?id=${id}`);
};

export const sendClientLoginCode = async (body) => {
  return await fetchPost(`${BASE_URL}/queues/verify-client-login-code`, body);
};
