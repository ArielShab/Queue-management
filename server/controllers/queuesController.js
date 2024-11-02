import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProviderQueuesByID = async (req, res) => {
	const { userId, day } = req.query;

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
		return res.status(401).json('Error getting opening or closing time');

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

		let formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
		availableQueues.push(formattedTime);
	}

	return res.status(200).json(availableQueues);
};
