import axios from 'axios';

export const createUser = async (body) => {
	try {
		// Make API request to create user
		const response = await axios.post(
			'http://localhost:5000/api/users',
			body,
		);
		return response;
	} catch (error) {
		// Handle and rethrow errors for the caller to handle
		console.error('API call failed:', error);
		throw error;
	}
};

export const loginUser = async (body) => {
	try {
		// Make API request to create user
		const response = await axios.post(
			'http://localhost:5000/api/users/login',
			body,
		);
		return response;
	} catch (error) {
		// Handle and rethrow errors for the caller to handle
		console.error('API call failed:', error);
		throw error;
	}
};
