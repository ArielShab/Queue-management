import axios from 'axios';
import { BASE_URL } from './index';

export const createUser = async (body) => {
	return await axios.post(`${BASE_URL}/users`, body);
};

export const loginUser = async (body) => {
	return await axios.post(`${BASE_URL}/users/login`, body);
};

export const verifyCode = async (body) => {
	return await axios.post(`${BASE_URL}/users/verify-code`, body);
};

export const getUserPersonalData = async ({ queryKey }) => {
	return await axios.get(
		`${BASE_URL}/users/get-user-personal-data?id=${+queryKey[1]}`,
	);
};

export const updateUserDataById = async (body) => {
	return await axios.put(`${BASE_URL}/users/update-user-data`, body);
};
