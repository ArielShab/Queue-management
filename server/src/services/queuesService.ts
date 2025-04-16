import { PrismaClient, Queue } from '@prisma/client';
import { generateCode } from '../utils/generateCode.ts';
import bcrypt from 'bcrypt';
import { sgSendEmail } from '../utils/sgSendEmail.ts';
import { ClientQueueRequest } from '../types/ClientQueueRequest.ts';
import dayjs from 'dayjs';
import { BookedQueue } from '../types/BookedQueue.ts';
import { ProviderFields } from '../types/ProviderFields.ts';

const prisma = new PrismaClient();

export const getProviderQueuesService = async (
  id: number,
  day: string,
  date: string,
): Promise<string[] | null> => {
  if (!date) return null;

  const [dateDay, month, year] = date?.trim().split('/'); // Separate day, month and year from date string
  const selectedDateStart: Date = new Date(`${year}-${month}-${dateDay}`); // Get begining of selected date
  const selectedDateEnd: Date = new Date(selectedDateStart); // Get end of selected date
  selectedDateEnd.setHours(23, 59, 59, 999);

  const userQueueDuration = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      queueDuration: true,
    },
  });

  if (!userQueueDuration) return null;

  // fetch working times of a specific day from db by user id
  const workingTimes = await prisma.workingTimes.findFirst({
    where: {
      AND: [{ userId: id }, { day: day }],
    },
  });

  if (!workingTimes) return null;

  // Get opening and closing hours for the selected day
  const { opening, closing } = workingTimes;

  // fetch all booked queues of specific date from db
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

  // Calculate minutes between opening and closing and return all the queues time
  let [startHour, startMinute] = opening.trim().split(':').map(Number);
  let [endHour, endMinute] = closing.trim().split(':').map(Number);

  let startInMinutes: number = startHour * 60 + startMinute;
  let endInMinutes: number = endHour * 60 + endMinute;
  let queueDuration: number = userQueueDuration.queueDuration;

  const availableQueues: string[] = [];

  // separate all queues by user queue duration
  for (
    let currentMinutes = startInMinutes;
    currentMinutes < endInMinutes;
    currentMinutes += queueDuration
  ) {
    let hours: number = Math.floor(currentMinutes / 60);
    let minutes: number = currentMinutes % 60;
    let formattedTime: string = `${hours}:${minutes.toString().padStart(2, '0')}`;

    const bookedQueue: Queue | undefined = bookedQueues.find((queue: Queue) => {
      const formattedQueue: string = `${queue.queueTime.getHours()}:${queue.queueTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      return formattedQueue === formattedTime;
    });

    if (!bookedQueue) availableQueues.push(formattedTime);
  }

  return availableQueues;
};

export const postClientQueueDataService = async (
  clientEmail: string,
  body: ClientQueueRequest,
): Promise<Queue | null> => {
  // check if client already exists
  let client = await prisma.client.findUnique({
    where: {
      clientEmail,
    },
  });

  // Generate a 6-digit random code
  const randomCode: string = generateCode();
  const expiresAt: Date = new Date(Date.now() + 5 * 60000);

  console.log('randomCode', randomCode);

  // Generate salt and hash the code using async/await for better flow
  const salt: string = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hash: string = await bcrypt.hash(randomCode, salt);

  if (!client) {
    // create new client
    client = await prisma.client.create({
      data: {
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        verificationCode: hash,
        codeExpiration: expiresAt,
      },
    });
  } else {
    // update client queues by client id
    client = await prisma.client.update({
      where: {
        id: client.id,
      },
      data: {
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        verificationCode: hash,
        codeExpiration: expiresAt,
      },
    });
  }

  if (!client) return null;

  // send random code to client mail using sendgrid
  await sgSendEmail(clientEmail, randomCode);

  // reset queue time seconds to check later the same time and date
  const modifiedTime: Date = new Date(body.queueTime);
  modifiedTime.setSeconds(0);
  modifiedTime.setMilliseconds(0);
  const modifiedTimeIso: string = modifiedTime.toISOString();

  // get queue from db by time
  let queue = await prisma.queue.findFirst({
    where: {
      queueTime: modifiedTimeIso,
      userId: body.userId,
    },
  });

  // check if queue exists and update it
  if (queue) {
    return await prisma.queue.update({
      where: {
        id: queue.id,
      },
      data: {
        queueTime: modifiedTimeIso,
        serviceId: body.serviceId,
        userId: body.userId,
        clientId: client.id,
      },
    });
  } else {
    // create new queue if doesnt exist
    return await prisma.queue.create({
      data: {
        queueTime: modifiedTimeIso,
        serviceId: body.serviceId,
        userId: body.userId,
        clientId: client.id,
      },
    });
  }
};

export const verifyClientQueueCodeService = async (
  queueTime: string,
  userId: number,
  verificationCode: string,
): Promise<Queue | null> => {
  // modify code to find the specific queue
  const modifiedTime: Date = new Date(queueTime);
  modifiedTime.setSeconds(0);
  modifiedTime.setMilliseconds(0);
  const modifiedTimeIso: string = modifiedTime.toISOString();

  // Fetch user queue by user id
  const queue = await prisma.queue.findFirst({
    where: { queueTime: modifiedTimeIso, userId },
  });

  if (!queue) return null;

  // get client of the queue to check if code valid
  const client = await prisma.client.findUnique({
    where: { id: queue.clientId },
  });

  if (!client || !client.verificationCode || !client.codeExpiration)
    return null;

  // check if code from front is valid
  const isCodeValid: boolean = await bcrypt.compare(
    verificationCode,
    client.verificationCode,
  );

  if (!isCodeValid) return null;

  // Check if the code is expired
  if (new Date() > client.codeExpiration) return null;

  // update queue is code is valid
  const updatedQueue = await prisma.queue.update({
    where: { id: queue.id },
    data: {
      queueApproved: true,
    },
  });

  if (!updatedQueue) return null;

  return updatedQueue;
};

export const getBookedQueuesService = async (
  id: number,
  isClient: boolean,
): Promise<{
  pastQueues: BookedQueue[];
  futureQueues: BookedQueue[];
} | null> => {
  let queues: Queue[] | null;

  if (isClient) {
    queues = await prisma.queue.findMany({
      where: {
        AND: [{ clientId: id }, { queueApproved: true }],
      },
    });
  } else {
    queues = await prisma.queue.findMany({
      where: {
        AND: [{ userId: id }, { queueApproved: true }],
      },
    });
  }

  if (!queues) return null;

  // get queue's data
  const queueDetails: (BookedQueue | null)[] = await Promise.all(
    queues.map(async (queue) => {
      // get queue service name
      const service = await prisma.service.findUnique({
        where: { id: queue.serviceId },
      });

      if (!service) return null;

      if (isClient) {
        // get queue user data
        const user = await prisma.user.findUnique({
          where: { id: queue.userId },
        });

        if (!user) return null;

        return {
          queueTime: queue.queueTime,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          serviceName: service.serviceName,
        } as BookedQueue;
      } else {
        // get queue client data
        const client = await prisma.client.findUnique({
          where: { id: queue.clientId },
        });

        if (!client) return null;

        return {
          queueTime: queue.queueTime,
          clientName: client.clientName,
          clientEmail: client.clientEmail,
          serviceName: service.serviceName,
        } as BookedQueue;
      }
    }),
  );

  // Filter out null values
  const validQueueDetails: BookedQueue[] = queueDetails.filter(
    (queue): queue is BookedQueue => queue !== null,
  );

  // get past queues
  const pastQueues: BookedQueue[] = validQueueDetails.filter((queue) =>
    dayjs(queue?.queueTime).isBefore(dayjs()),
  );
  // get future queues
  const futureQueues: BookedQueue[] = validQueueDetails.filter((queue) =>
    dayjs(queue?.queueTime).isAfter(dayjs()),
  );

  return { pastQueues, futureQueues };
};

export const getProviderDataService = async (
  id: number,
): Promise<ProviderFields | null> => {
  // get provider data by provider id
  const provider = await prisma.user.findUnique({ where: { id } });

  if (!provider) return null;

  return {
    firstName: provider.firstName,
    lastName: provider.lastName,
    email: provider.email,
    phone: provider.phone,
  };
};
