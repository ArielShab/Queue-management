import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

// Generate random 6-digit code
const generateCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const createUser = async (req, res) => {
	const data = { ...req.body };

	try {
		// Generate a 6-digit random code
		const randomCode = generateCode();
		const expiresAt = new Date(Date.now() + 5 * 60000);

		// Generate salt and hash the code using async/await for better flow
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(randomCode, salt);

		console.log('randomCode', randomCode);

		data.verificationCode = hash;
		// data.verificationCode = randomCode;
		data.codeExpiration = expiresAt;

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
	const { email } = req.body;

	// Check if the user exists
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		return res.status(401).json({ message: 'Invalid email' });
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
				await prisma.user.update({
					where: { email },
					data: {
						verificationCode: hash,
						codeExpiration: expiresAt,
					},
				});

				res.status(200).json({
					message: 'Verification code sent to your email',
				});
			});
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
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
			return res.status(401).json({ message: 'Invalid email or code' });
		}

		const isCodeValid = await bcrypt.compare(code, user.verificationCode);

		if (!isCodeValid) {
			return res.status(401).json({ message: 'Invalid code' });
		}

		// Check if the code is expired
		if (new Date() > user.codeExpiration) {
			return res.status(401).json({ message: 'Code has expired' });
		}

		// Generate a JWT token after successful verification
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '12h' },
		);

		// Return the token and user data
		res.json({ token });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};
