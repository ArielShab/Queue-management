import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUserServicesById = async (req, res) => {
	const { id } = req.query;

	try {
		const services = await prisma.service.findMany({
			where: { userId: +id },
		});

		if (!services)
			return res
				.status(401)
				.json({ success: false, message: 'Invalid user id' });

		return res.status(200).json({ success: true, data: services });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const createUserServicesById = async (req, res) => {
	try {
		const service = await prisma.service.create({
			data: req.body,
		});

		if (service)
			return res.status(201).json({ success: true, data: service });

		return res
			.status(401)
			.json({ success: false, message: "Couldn't create service" });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: 'Internal server error' });
	}
};

export const updateUserService = async (req, res) => {
	const { id, serviceName } = req.body;
	try {
		const service = await prisma.service.update({
			where: { id },
			data: {
				serviceName,
			},
		});

		if (service) {
			return res
				.status(201)
				.json({ success: true, data: 'Service updated !' });
		}
		return res
			.status(401)
			.json({ success: false, message: "Couldn't update service" });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: 'Internal server error' });
	}
};

export const deleteUserService = async (req, res) => {
	const { id } = req.query;

	try {
		const serviceQueues = await prisma.queue.findMany({
			where: { serviceId: +id },
		});

		if (serviceQueues.length) {
			return res.status(401).json({
				success: false,
				message: "Can't delete service of existing queues",
			});
		}

		const response = await prisma.service.delete({
			where: {
				id: +id,
			},
		});

		if (response) {
			return res
				.status(200)
				.json({ success: true, data: 'Service deleted !' });
		}

		return res
			.status(401)
			.json({ success: false, message: "Couldn't delete service" });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: 'Internal server error' });
	}
};
