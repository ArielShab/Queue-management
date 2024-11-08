import { BASE_URL, fetchDelete, fetchGet, fetchPost, fetchPut } from './index';

export const getUserServices = async ({ queryKey }) => {
	return await fetchGet(
		`${BASE_URL}/services/get-user-services?id=${+queryKey[1]}`,
	);
};

export const createUserService = async (body) => {
	return await fetchPost(`${BASE_URL}/services/create-user-services`, body);
};

export const updateUserService = async (body) => {
	return await fetchPut(`${BASE_URL}/services/update-user-service`, body);
};

export const deleteUserService = async (serviceId) => {
	return await fetchDelete(
		`${BASE_URL}/services/delete-user-service?id=${serviceId}`,
	);
};
