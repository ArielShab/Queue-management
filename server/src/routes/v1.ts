import express from 'express';
import usersRouter from './usersRouter.ts';
import servicesRouter from './servicesRouter.ts';
import queuesRouter from './queuesRouter.ts';

const router = express.Router();

router.use('/api/users', usersRouter);
router.use('/api/services', servicesRouter);
router.use('/api/queues', queuesRouter);

export default router;
