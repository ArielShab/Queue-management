import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

const saltRounds = 10;

// Generate random 6-digit code
const generateCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const getProviderQueuesByID = async (req, res) => {
	const { userId, day } = req.query;

	try {
		const { queueDuration } = await prisma.user.findUnique({
			where: {
				id: +userId,
			},
			select: {
				queueDuration: true,
			},
		});
		const { opening, closing } = await prisma.workingTimes.findFirst({
			where: {
				AND: [{ userId: +userId }, { day: day }],
			},
		});

		if (!opening || !closing)
			return res.status(401).json({
				success: false,
				message: 'Error getting opening or closing time',
			});

		// Calculate minutes between opening and closing and return all the queues time
		let [startHour, startMinute] = opening.trim().split(':').map(Number);
		let [endHour, endMinute] = closing.trim().split(':').map(Number);

		let startInMinutes = startHour * 60 + startMinute;
		let endInMinutes = endHour * 60 + endMinute;

		const availableQueues = [];

		for (
			let currentMinutes = startInMinutes;
			currentMinutes < endInMinutes;
			currentMinutes += queueDuration
		) {
			let hours = Math.floor(currentMinutes / 60);
			let minutes = currentMinutes % 60;

			let formattedTime = `${hours}:${minutes
				.toString()
				.padStart(2, '0')}`;
			availableQueues.push(formattedTime);
		}

		return res.status(200).json({ success: true, data: availableQueues });
	} catch (error) {
		console.error('error', error);
		return res
			.status(500)
			.json({ success: false, message: 'Internal server error' });
	}
};

export const postClientQueueData = async (req, res) => {
	try {
		// Generate a 6-digit random code
		const randomCode = generateCode();
		const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes from now

		bcrypt.genSalt(saltRounds, async (err, salt) => {
			if (err) {
				console.log('Salt generation error:', err);
				return res
					.status(500)
					.json({ success: false, message: 'Internal server error' });
			}

			bcrypt.hash(randomCode, salt, async (err, hash) => {
				if (err) {
					console.log('Hashing error:', err);
					return res.status(500).json({
						success: false,
						message: 'Internal server error',
					});
				}

				// Hashing successful, 'hash' contains the hashed password
				console.log('randomCode', randomCode);
				const queue = await prisma.queue.create({
					data: {
						...req.body,
						verificationCode: hash,
						codeExpiration: expiresAt,
					},
				});

				if (queue) {
					return res.status(201).json({
						success: true,
						data: 'Verification code sent to your email',
					});
				}

				return res
					.status(401)
					.json({ success: false, message: 'Could not save ququq' });
			});
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: 'Internal server error' });
	}
};
