import express from 'express';
import {
	createUserServicesById,
	deleteUserService,
	getUserServicesById,
	updateUserService,
} from '../controllers/servicesController.js';

const router = express.Router();

// Get all user's services
router.get('/get-user-services', getUserServicesById);

// Create new service for a user
router.post('/create-user-services', createUserServicesById);

// Update user's service
router.put('/update-user-service', updateUserService);

// Delete user's service
router.delete('/delete-user-service', deleteUserService);

export default router;
