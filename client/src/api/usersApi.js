import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api/users';

export const createUser = async (body) => {
	return await axios.post(BASE_URL, body);
};

export const loginUser = async (body) => {
	return await axios.post(`${BASE_URL}/login`, body);
};

export const verifyCode = async (body) => {
	return await axios.post(`${BASE_URL}/verify-code`, body);
};

// export const fetchUserById = async (id) => {
// 	return await axios.get(`${BASE_URL}/get-user-by-id?id=${id}`);
// };

export const getUserPersonalData = async ({ queryKey }) => {
	return await axios.get(
		`${BASE_URL}/get-user-personal-data?id=${+queryKey[1]}`,
	);
};

export const updateUserDataById = async (body) => {
	return await axios.put(`${BASE_URL}/update-user-data`, body);
};
