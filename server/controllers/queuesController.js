import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

const saltRounds = 10;

// Generate random 6-digit code
const generateCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const getProviderQueuesByID = async (req, res) => {
	const { userId, day, date } = req.query;

	const [dateDay, month, year] = date.trim().split('/');
	const selectedDateStart = new Date(`${year}-${month}-${dateDay}`);
	const selectedDateEnd = new Date(selectedDateStart);
	selectedDateEnd.setHours(23, 59, 59, 999);
	// .toISOString()

	try {
		const { queueDuration } = await prisma.user.findUnique({
			where: {
				id: +userId,
			},
			select: {
				queueDuration: true,
			},
		});

		const workingTimes = await prisma.workingTimes.findFirst({
			where: {
				AND: [{ userId: +userId }, { day: day }],
			},
		});

		if (!workingTimes) {
			return res.status(401).json({
				success: false,
				message: 'Not available at the specific date',
			});
		}

		// Get opening and closing hours for the selected day
		const { opening, closing } = workingTimes;

		const bookedQueues = await prisma.queue.findMany({
			where: {
				AND: [
					{
						queueTime: {
							gte: selectedDateStart,
							lte: selectedDateEnd,
						},
					},
					{ queueApproved: true },
				],
			},
		});

		// if (!opening || !closing) {
		// 	return res.status(401).json({
		// 		success: false,
		// 		message: 'Error getting opening or closing time',
		// 	});
		// }

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

			const bookedQueue = bookedQueues.find((queue) => {
				const formattedQueue = `${queue.queueTime.getHours()}:${queue.queueTime
					.getMinutes()
					.toString()
					.padStart(2, '0')}`;

				return formattedQueue === formattedTime;
			});

			if (!bookedQueue) availableQueues.push(formattedTime);
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

				let queue = await prisma.queue.findFirst({
					where: {
						queueTime: req.body.queueTime,
						userId: req.body.userId,
					},
				});

				if (queue) {
					const newQueue = await prisma.queue.update({
						where: {
							id: queue.id,
						},
						data: {
							...req.body,
							verificationCode: hash,
							codeExpiration: expiresAt,
						},
					});

					if (newQueue) {
						return res.status(201).json({
							success: true,
							data: 'Verification code sent to your email',
						});
					}
				} else {
					queue = await prisma.queue.create({
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
				}

				return res
					.status(401)
					.json({ success: false, message: 'Could not save queue' });
			});
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: 'Internal server error' });
	}
};

export const verifyClientCode = async (req, res) => {
	const { queueTime, userId, verificationCode } = req.body;

	try {
		// Fetch user
		const queue = await prisma.queue.findFirst({
			where: { queueTime, userId },
		});

		if (!queue) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid code' });
		}

		const isCodeValid = await bcrypt.compare(
			verificationCode,
			queue.verificationCode,
		);

		if (!isCodeValid) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid code' });
		}

		// Check if the code is expired
		if (new Date() > queue.codeExpiration) {
			return res
				.status(401)
				.json({ success: false, message: 'Code has expired' });
		}

		const updatedQueue = await prisma.queue.update({
			where: { id: queue.id },
			data: {
				queueApproved: true,
			},
		});

		if (!updatedQueue) {
			return res
				.status(401)
				.json({ success: false, message: 'Could not book queue' });
		}

		// Return the token and user data
		return res.status(200).json({ success: true, data: 'Queue booked' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const getBookedQueues = async (req, res) => {
	const { id } = req.query;

	try {
		const queues = await prisma.queue.findMany({
			where: {
				AND: [{ userId: +id }, { queueApproved: true }],
			},
			select: {
				id: true,
				clientEmail: true,
				clientName: true,
				queueTime: true,
			},
		});

		if (!queues) {
			return res.status(401).json({
				success: false,
				message: 'Could not get booked queues',
			});
		}

		const pastQueues = [];
		const futureQueues = [];

		queues.forEach((queue) => {
			if (dayjs(queue.queueTime).isAfter(dayjs()))
				futureQueues.push(queue);
			else pastQueues.push(queue);
		});

		return res
			.status(200)
			.json({ success: true, data: { pastQueues, futureQueues } });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const deleteQueueById = async (req, res) => {
	const { id } = req.query;

	try {
		const deletedQueue = await prisma.queue.delete({ where: { id: +id } });

		if (!deletedQueue) {
			return res
				.status(401)
				.json({ success: false, message: 'Could not delete queue' });
		}

		return res.status(200).json({ success: true, data: deletedQueue });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: 'Internal server error' });
	}
};
