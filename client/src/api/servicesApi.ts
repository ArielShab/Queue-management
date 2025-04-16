import { fetchDelete, fetchGet, fetchPost, fetchPut } from './index';

export const getUserServices = async ({
  queryKey,
}: {
  queryKey: Array<number | string>;
}) => {
  return await fetchGet(`/services/get-user-services?id=${+queryKey[1]}`);
};

export const createUserService = async (body: {
  userId: number;
  serviceName: string;
}) => {
  return await fetchPost(`/services/create-user-services`, body);
};

export const updateUserService = async (body: {
  id: number;
  serviceName: string;
}) => {
  return await fetchPut(`/services/update-user-service`, body);
};

export const deleteUserService = async (serviceId: number) => {
  return await fetchDelete(`/services/delete-user-service?id=${serviceId}`);
};
