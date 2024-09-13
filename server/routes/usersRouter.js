import express from 'express';
import {
	createUser,
	loginUser,
	verifyLoginCode,
} from '../controllers/usersController.js';

const router = express.Router();

// Creating user
router.post('/', createUser);

// Login user
router.post('/login', loginUser);

// Verify login code
router.post('/verify-code', verifyLoginCode);

export default router;
