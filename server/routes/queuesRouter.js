import express from "express";
import {
  deleteQueueById,
  getBookedQueues,
  getClientBookedQueues,
  getProviderQueuesByID,
  postClientQueueData,
  verifyClientQueueCode,
} from "../controllers/queuesController.js";

const router = express.Router();

// Get all user's queues
router.get("/", getProviderQueuesByID);

// Send client queue data
router.post("/send-client-queue-data", postClientQueueData);

// Verify client code
router.post("/verify-client-queue-code", verifyClientQueueCode);

// get user queues
router.get("/get-booked-queues", getBookedQueues);

// Delete queue by id
router.delete("/delete-queue-by-id", deleteQueueById);

// get client queues
router.get("/get-client-queues", getClientBookedQueues);

export default router;
