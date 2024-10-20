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
