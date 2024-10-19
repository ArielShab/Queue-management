import express from 'express';
import {
	createUser,
	loginUser,
	verifyLoginCode,
	// getUserById,
	getUserPersonalData,
	updateUserData,
} from '../controllers/usersController.js';

const router = express.Router();

// Creating user
router.post('/', createUser);

// Login user
router.post('/login', loginUser);

// Verify login code
router.post('/verify-code', verifyLoginCode);

// Get user by id
// router.get('/get-user-by-id', getUserById);

// Get user personal data
router.get('/get-user-personal-data', getUserPersonalData);

// Update user data by id
router.put('/update-user-data', updateUserData);

export default router;
