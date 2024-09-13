import express from 'express';
import { createUser, loginUser } from '../controllers/usersController.js';

const router = express.Router();

// Creating user
router.post('/', createUser);

// Login user
router.post('/login', loginUser);

export default router;
