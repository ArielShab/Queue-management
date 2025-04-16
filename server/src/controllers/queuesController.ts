import { Request, Response } from 'express';
import {
  getBookedQueuesService,
  getProviderDataService,
  getProviderQueuesService,
  postClientQueueDataService,
  verifyClientQueueCodeService,
} from '../services/queuesService.ts';
import { Queue } from '@prisma/client';
import { BookedQueue } from '../types/BookedQueue.ts';
import { ProviderFields } from '../types/ProviderFields.ts';

export const getProviderQueuesByID = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, day, date } = req.query;

  try {
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    // Ensure userId, day, and date are valid
    if (
      typeof userId !== 'string' ||
      typeof day !== 'string' ||
      typeof date !== 'string'
    ) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
      });
      return;
    }

    // get user available queues
    const availableQueues: string[] | null = await getProviderQueuesService(
      Number(userId),
      day,
      date,
    );

    if (!availableQueues) {
      res.status(401).json({
        success: false,
        message: 'Not available queues at the specific date',
      });
      return;
    }

    res.status(200).json({ success: true, data: availableQueues });
  } catch (error: unknown) {
    console.error('error', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const postClientQueueData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { clientEmail } = req.body;

  try {
    // book new client queue
    const queue: Queue | null = await postClientQueueDataService(
      clientEmail,
      req.body,
    );

    if (!queue) {
      res.status(401).json({
        success: false,
        message: 'Could not save queue',
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: 'Verification code sent to your email',
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const verifyClientQueueCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { queueTime, userId, verificationCode } = req.body;

  try {
    // check if user id valid
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    // verify client queue
    const queue: Queue | null = await verifyClientQueueCodeService(
      queueTime,
      Number(userId),
      verificationCode,
    );

    if (!queue) {
      res.status(401).json({ success: false, message: 'Invalid code' });
      return;
    }

    // Return the token and user data
    res.status(200).json({ success: true, data: 'Queue booked' });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getBookedQueues = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id, isClient } = req.query;

  try {
    // check if user id valid
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    // Convert isClient to a boolean
    const isClientBoolean = isClient === 'true';

    // get booked queues
    const bookedQueues: {
      pastQueues: BookedQueue[];
      futureQueues: BookedQueue[];
    } | null = await getBookedQueuesService(Number(id), isClientBoolean);

    if (!bookedQueues) {
      res.status(401).json({
        success: false,
        message: 'Could not get booked queues',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: bookedQueues,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getProviderData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.query;

  try {
    // check if user id valid
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Provider ID is required',
      });
      return;
    }

    const provider: ProviderFields | null = await getProviderDataService(
      Number(id),
    );

    if (!provider) {
      res.status(401).json({
        success: false,
        message: 'Invalid provider id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
