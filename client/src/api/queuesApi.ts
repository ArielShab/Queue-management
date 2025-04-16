import { ClientQueueDataType } from '../types/ClientQueueDataType';
import { UserQueuesTimesType } from '../types/UserQueuesTimesType';
import { fetchGet, fetchPost } from './index';

export const fetchUserQueuesTimes = async ({
  queryKey,
}: UserQueuesTimesType) => {
  const { providerId, selectedDayName, selectedDate } = queryKey[1];
  return await fetchGet(
    `queues?userId=${providerId}&day=${selectedDayName}&date=${selectedDate}`,
  );
};

export const sendClientQueueData = async (body: ClientQueueDataType) => {
  return await fetchPost(`queues/send-client-queue-data`, body);
};

export const sendClientVerificationCode = async (body: {
  queueTime: string;
  userId: number;
  verificationCode: string;
}) => {
  return await fetchPost(`queues/verify-client-queue-code`, body);
};

export const fetchBookedQueues = async ({
  queryKey,
}: {
  queryKey: Array<string | boolean>;
}) => {
  return await fetchGet(
    `/queues/get-booked-queues?id=${queryKey[1]}&isClient=${queryKey[2]}`,
  );
};

export const fetchProviderData = async ({
  queryKey,
}: {
  queryKey: Array<number | string>;
}) => {
  return await fetchGet(`queues/get-provider-data?id=${+queryKey[1]}`);
};
