import express from 'express';
import {
  createUser,
  loginUser,
  verifyLoginCode,
  getUserPersonalData,
  updateUserData,
  getUserWorkingDays,
  updateUserWorkingDays,
  deleteUserWorkingDay,
  addUserDayOfWork,
} from '../controllers/usersController.ts';
import verifyToken from '../middlewares/verifyToken.ts';
import { validateSignUp } from '../middlewares/validateSignUp.ts';
import { validateLogin } from '../middlewares/validateLogin.ts';
import { validateLoginCode } from '../middlewares/validateLoginCode.ts';
import { validateId } from '../middlewares/validateId.ts';
import { validateUserData } from '../middlewares/validateUserData.ts';
import { validateWorkingDays } from '../middlewares/validateWorkingDays.ts';
import { validateWorkingDay } from '../middlewares/validateWorkingDay.ts';

const router = express.Router();

// Creating user
router.post('/', validateSignUp, createUser);

// Login user
router.post('/login', validateLogin, loginUser);

// Verify login code
router.post('/verify-code', validateLoginCode, verifyLoginCode);

// Get user personal data
router.get(
  '/get-user-personal-data',
  verifyToken,
  validateId,
  getUserPersonalData,
);

// Get user working days
router.get('/get-working-days', verifyToken, validateId, getUserWorkingDays);

// Update user data by id
router.put('/update-user-data', verifyToken, validateUserData, updateUserData);

// Update user working days
router.put(
  '/update-user-working-days',
  verifyToken,
  validateWorkingDays,
  updateUserWorkingDays,
);

// Delete user working day by id
router.delete(
  '/delete-user-working-day',
  verifyToken,
  validateId,
  deleteUserWorkingDay,
);

// Add user working day
router.post(
  '/add-user-working-day',
  verifyToken,
  validateWorkingDay,
  addUserDayOfWork,
);

export default router;
