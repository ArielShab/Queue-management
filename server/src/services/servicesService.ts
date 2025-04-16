import { PrismaClient, Service } from '@prisma/client';
import { UserService } from '../types/UserService';

const prisma = new PrismaClient();

export const getUserServicesService = async (
  id: number,
): Promise<UserService[] | null> => {
  const services = await prisma.service.findMany({
    where: { userId: id },
    select: {
      id: true,
      serviceName: true,
    },
  });

  if (!services) return null;

  return services;
};

export const createUserServicesService = async (
  body: Service,
): Promise<Service | null> => {
  const service = await prisma.service.create({
    data: body,
  });

  if (!service) return null;

  return service;
};

export const updateServiceOfUserService = async (
  id: number,
  serviceName: string,
): Promise<Service | null> => {
  const service = await prisma.service.update({
    where: { id },
    data: {
      serviceName,
    },
  });

  if (!service) return null;

  return service;
};

export const deleteServiceOfUserService = async (
  id: number,
): Promise<Service | null> => {
  const serviceQueues = await prisma.queue.findFirst({
    where: { serviceId: id },
  });

  if (serviceQueues) return null;

  // if there are no queues of the service delete service by id
  const service = await prisma.service.delete({
    where: {
      id,
    },
  });

  if (!service) return null;

  return service;
};
