import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

export const createUser = async (req, res) => {
	const data = { ...req.body };

	// Generate a 6-digit random code
	const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

	bcrypt.genSalt(saltRounds, (err, salt) => {
		if (err) {
			console.log('err', err);
			return;
		}

		bcrypt.hash(randomCode, salt, (err, hash) => {
			if (err) {
				console.log('err', err);

				return;
			}

			// Hashing successful, 'hash' contains the hashed password
			console.log('Hashed code:', hash);
			data.tempCode = randomCode;
		});
	});

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

export const loginUser = async (req, res) => {
	const data = { ...req.body };

	// Check if the user exists
	const user = await prisma.user.findUnique({
		where: { email: data.email },
	});

	if (!user) {
		return res.status(401).json({ message: 'Invalid email' });
	}

	// Generate a 6-digit random code
	const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

	bcrypt.genSalt(saltRounds, (err, salt) => {
		if (err) {
			console.log('err', err);
			return;
		}

		bcrypt.hash(randomCode, salt, (err, hash) => {
			if (err) {
				console.log('err', err);

				return;
			}

			// Hashing successful, 'hash' contains the hashed password
			console.log('Hashed code:', hash);
		});
	});

	try {
		// res.status(201).json({ success: true, data: user.email });
	} catch (error) {
		// console.error(error);
		// res.status(500).json({
		// 	success: false,
		// 	message: 'Internal server error',
		// });
	}
};
