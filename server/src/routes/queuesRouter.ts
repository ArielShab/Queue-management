import express from 'express';
import {
  getBookedQueues,
  getProviderQueuesByID,
  postClientQueueData,
  verifyClientQueueCode,
  getProviderData,
} from '../controllers/queuesController.ts';
import verifyToken from '../middlewares/verifyToken.ts';
import { validateProviderQueues } from '../middlewares/validateProviderQueues.ts';
import { validateClientQueueData } from '../middlewares/validateClientQueueData.ts';
import { validateBookQueueCode } from '../middlewares/validateBookQueueCode.ts';
import { validateGetBookedQueues } from '../middlewares/validateGetBookedQueues.ts';
import { validateId } from '../middlewares/validateId.ts';

const router = express.Router();

// Get all user's queues
router.get('/', validateProviderQueues, getProviderQueuesByID);

// Send client queue data
router.post(
  '/send-client-queue-data',
  validateClientQueueData,
  postClientQueueData,
);

// Verify client code
router.post(
  '/verify-client-queue-code',
  validateBookQueueCode,
  verifyClientQueueCode,
);

// get user queues
router.get(
  '/get-booked-queues',
  verifyToken,
  validateGetBookedQueues,
  getBookedQueues,
);

// get provider data
router.get('/get-provider-data', validateId, getProviderData);

export default router;
