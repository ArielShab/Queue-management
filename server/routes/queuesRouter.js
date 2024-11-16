import express from 'express';
import {
	getBookedQueues,
	getProviderQueuesByID,
	postClientQueueData,
	verifyClientCode,
} from '../controllers/queuesController.js';

const router = express.Router();

// Get all user's queues
router.get('/', getProviderQueuesByID);

// Send client queue data
router.post('/send-client-queue-data', postClientQueueData);

// Verify client code
router.post('/verify-client-code', verifyClientCode);

router.get('/get-booked-queues', getBookedQueues);

export default router;
