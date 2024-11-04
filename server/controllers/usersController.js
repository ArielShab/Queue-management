import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

// Generate random 6-digit code
const generateCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const createUser = async (req, res) => {
	const fieldsValues = { ...req.body.fieldsValues };
	const workingDays = req.body.workingDays;

	try {
		// Generate a 6-digit random code
		const randomCode = generateCode();
		const expiresAt = new Date(Date.now() + 5 * 60000);

		// Generate salt and hash the code using async/await for better flow
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(randomCode, salt);

		console.log('randomCode', randomCode);

		fieldsValues.verificationCode = hash;
		fieldsValues.codeExpiration = expiresAt;

		// Create a new user in the database
		const user = await prisma.user.create({
			data: fieldsValues,
		});

		if (user) {
			const finalWorkingDays = [];
			workingDays.forEach((dayObj) => {
				finalWorkingDays.push({ userId: user.id, ...dayObj });
			});

			const workingTimes = await prisma.workingTimes.createMany({
				data: finalWorkingDays,
			});

			if (workingTimes) return res.status(201).json(user.email);
		}

		return res.status(401).json("Couldn't create user");
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const loginUser = async (req, res) => {
	const { email } = req.body;

	// Check if the user exists
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		return res.status(401).json('Invalid email');
	}

	try {
		// Generate a 6-digit random code
		const randomCode = generateCode();
		const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes from now

		bcrypt.genSalt(saltRounds, async (err, salt) => {
			if (err) {
				console.log('Salt generation error:', err);
				return res
					.status(500)
					.json({ message: 'Internal server error' });
			}

			bcrypt.hash(randomCode, salt, async (err, hash) => {
				if (err) {
					console.log('Hashing error:', err);
					return res
						.status(500)
						.json({ message: 'Internal server error' });
				}

				// Hashing successful, 'hash' contains the hashed password
				console.log('randomCode', randomCode);
				const user = await prisma.user.update({
					where: { email },
					data: {
						verificationCode: hash,
						codeExpiration: expiresAt,
					},
				});

				if (user) {
					return res
						.status(200)
						.json('Verification code sent to your email');
				}
			});
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const verifyLoginCode = async (req, res) => {
	const { email, code } = req.body;

	try {
		// Fetch user
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(401).json('Invalid email or code');
		}

		const isCodeValid = await bcrypt.compare(code, user.verificationCode);

		if (!isCodeValid) {
			return res.status(401).json('Invalid code');
		}

		// Check if the code is expired
		if (new Date() > user.codeExpiration) {
			return res.status(401).json('Code has expired');
		}

		// Generate a JWT token after successful verification
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '12h' },
		);

		// Return the token and user data
		return res.status(200).json(token);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const getUserPersonalData = async (req, res) => {
	const { id } = req.query;

	try {
		const user = await prisma.user.findUnique({ where: { id: +id } });

		if (!user) return res.status(401).json('Invalid user id');

		return res.status(200).json({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
			queueDuration: user.queueDuration,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const getUserWorkingDays = async (req, res) => {
	const { id } = req.query;

	try {
		const workingDays = await prisma.workingTimes.findMany({
			where: { userId: +id },
		});

		if (!workingDays)
			return res.status(401).json("Couldn't get working days");

		return res.status(200).json(workingDays);
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const updateUserData = async (req, res) => {
	const { id } = req.body;
	let keyLabel = '';
	Object.keys(req.body).forEach((key) => {
		if (key !== 'id') keyLabel = key;
	});

	try {
		const user = await prisma.user.update({
			where: { id: +id },
			data: {
				[keyLabel]: req.body[keyLabel],
			},
		});

		if (user) {
			return res.status(201).json({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone,
				queueDuration: user.queueDuration,
			});
		}

		return res.status(401).json("Couldn't update user");
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const updateUserWorkingDays = async (req, res) => {
	const { id, opening, closing } = req.body;

	try {
		const workingDay = await prisma.workingTimes.update({
			where: {
				id,
			},
			data: {
				opening,
				closing,
			},
		});

		if (workingDay) return res.status(200).json(workingDay);

		return res.status(401).json('Could not update working day');
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const deleteUserWorkingDay = async (req, res) => {
	const { id } = req.query;

	console.log('id', id);

	try {
		const response = await prisma.workingTimes.delete({
			where: {
				id: +id,
			},
		});

		if (response) return res.status(200).json('Day was deleted !');

		return res.status(401).json('Could not delete working day');
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};
