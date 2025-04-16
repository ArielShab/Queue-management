import express from 'express';
import {
  createUserServicesById,
  deleteUserService,
  getUserServicesById,
  updateUserService,
} from '../controllers/servicesController.ts';
import verifyToken from '../middlewares/verifyToken.ts';
import { validateId } from '../middlewares/validateId.ts';
import { validateCreateUserService } from '../middlewares/validateCreateUserService.ts';
import { validateUpdateUserService } from '../middlewares/validateUpdateUserService.ts';

const router = express.Router();

// Get all user's services
router.get('/get-user-services', validateId, getUserServicesById);

// Create new service for a user
router.post(
  '/create-user-services',
  verifyToken,
  validateCreateUserService,
  createUserServicesById,
);

// Update user's service
router.put(
  '/update-user-service',
  verifyToken,
  validateUpdateUserService,
  updateUserService,
);

// Delete user's service
router.delete(
  '/delete-user-service',
  verifyToken,
  validateId,
  deleteUserService,
);

export default router;
