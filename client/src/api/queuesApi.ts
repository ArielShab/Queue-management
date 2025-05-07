import { ClientQueueDataType } from '../types/ClientQueueDataType';
import { UserQueuesTimesType } from '../types/UserQueuesTimesType';
import { fetchGet, fetchPost } from './index';

export const fetchUserQueuesTimes = async ({
  providerId,
  selectedDayName,
  selectedDate,
}: UserQueuesTimesType) => {
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

export const fetchBookedQueues = async (id: number, isClient: boolean) => {
  return await fetchGet(
    `/queues/get-booked-queues?id=${id}&isClient=${isClient}`,
  );
};

export const fetchProviderData = async (id: number) => {
  return await fetchGet(`queues/get-provider-data?id=${id}`);
};
