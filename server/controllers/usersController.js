import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
	const data = { ...req.body };

	// Generate a 6-digit random code
	const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
	data.tempCode = randomCode;

	try {
		// Create a new user in the database
		const user = await prisma.user.create({
			data: data,
		});

		res.status(201).json({ success: true, data: user.email });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};
