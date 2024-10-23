import axios from 'axios';
import { BASE_URL } from './index';

export const getUserServices = async ({ queryKey }) => {
	return await axios.get(
		`${BASE_URL}/services/get-user-services?id=${+queryKey[1]}`,
	);
};

export const createUserService = async (body) => {
	return await axios.post(`${BASE_URL}/services/create-user-services`, body);
};

export const updateUserService = async (body) => {
	return await axios.put(`${BASE_URL}/services/update-user-service`, body);
};

export const deleteUserService = async (serviceId) => {
	return await axios.delete(
		`${BASE_URL}/services/delete-user-service?id=${serviceId}`,
	);
};
