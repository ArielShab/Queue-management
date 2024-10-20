import express from 'express';
import {
	createUserServicesById,
	getUserServicesById,
} from '../controllers/servicesController.js';

const router = express.Router();

router.get('/get-user-services', getUserServicesById);

router.post('/create-user-services', createUserServicesById);

export default router;
