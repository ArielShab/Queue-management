import { BASE_URL, fetchDelete, fetchGet, fetchPost, fetchPut } from './index';

export const createUser = async (body) => {
	return await fetchPost(`${BASE_URL}/users`, body);
};

export const loginUser = async (body) => {
	return await fetchPost(`${BASE_URL}/users/login`, body);
};

export const verifyCode = async (body) => {
	return await fetchPost(`${BASE_URL}/users/verify-code`, body);
};

export const getUserPersonalData = async ({ queryKey }) => {
	return await fetchGet(
		`${BASE_URL}/users/get-user-personal-data?id=${+queryKey[1]}`,
	);
};

export const getUserWorkingDays = async ({ queryKey }) => {
	return await fetchGet(
		`${BASE_URL}/users/get-working-days?id=${+queryKey[1]}`,
	);
};

export const updateUserDataById = async (body) => {
	return await fetchPut(`${BASE_URL}/users/update-user-data`, body);
};

export const updateUserWorkingDays = async (body) => {
	return await fetchPut(`${BASE_URL}/users/update-user-working-days`, body);
};

export const deleteUserWorkingDay = async (id) => {
	return await fetchDelete(
		`${BASE_URL}/users/delete-user-working-day?id=${id}`,
	);
};

export const addUserWorkingDay = async (body) => {
	return await fetchPost(`${BASE_URL}/users/add-user-working-day`, body);
};
