import express from 'express';
import { getProviderQueuesByID } from '../controllers/queuesController.js';

const router = express.Router();

// Get all user's queues
router.get('/', getProviderQueuesByID);

export default router;
