import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProviderQueuesByID = async (req, res) => {
	const { userId, date } = req.query;

	console.log('date', date);
};
