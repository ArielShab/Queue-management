import express from 'express';
import {
	getProviderQueuesByID,
	postClientQueueData,
} from '../controllers/queuesController.js';

const router = express.Router();

// Get all user's queues
router.get('/', getProviderQueuesByID);

// Send client queue data
router.post('/send-client-queue-data', postClientQueueData);

export default router;
