import express from "express";
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
  sendCodeToClient,
  verifyClientLoginCode,
} from "../controllers/usersController.js";

const router = express.Router();

// Creating user
router.post("/", createUser);

// Login user
router.post("/login", loginUser);

// Verify login code
router.post("/verify-code", verifyLoginCode);

// Get user personal data
router.get("/get-user-personal-data", getUserPersonalData);

// Get user working days
router.get("/get-working-days", getUserWorkingDays);

// Update user data by id
router.put("/update-user-data", updateUserData);

// Update user working days
router.put("/update-user-working-days", updateUserWorkingDays);

// Delete user working day by id
router.delete("/delete-user-working-day", deleteUserWorkingDay);

// Add user working day
router.post("/add-user-working-day", addUserDayOfWork);

// Send verification code to client email
router.post("/send-code-to-client-mail", sendCodeToClient);

// Verify client code
router.post("/verify-client-login-code", verifyClientLoginCode);

export default router;
