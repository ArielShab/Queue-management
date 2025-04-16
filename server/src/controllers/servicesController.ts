import { Service } from '@prisma/client';
import { Request, Response } from 'express';
import {
  createUserServicesService,
  deleteServiceOfUserService,
  getUserServicesService,
  updateServiceOfUserService,
} from '../services/servicesService.ts';
import { UserService } from '../types/UserService.ts';

export const getUserServicesById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.query;

  try {
    // check if user id valid
    if (!id) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    // get services of user by user id
    const services: UserService[] | null = await getUserServicesService(
      Number(id),
    );

    if (!services) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    res.status(200).json({ success: true, data: services });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createUserServicesById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // create new servie to user by user id
    const service: Service | null = await createUserServicesService(req.body);

    if (!service) {
      res.status(401).json({
        success: false,
        message: "Couldn't create service",
      });
      return;
    }

    res.status(201).json({ success: true, data: service });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateUserService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id, serviceName } = req.body;

  try {
    // check if user id valid
    if (!id) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    // update user service by user id and service name
    const service: Service | null = await updateServiceOfUserService(
      Number(id),
      serviceName,
    );

    if (!service) {
      res.status(401).json({
        success: false,
        message: "Couldn't update service",
      });
      return;
    }

    res.status(201).json({ success: true, data: 'Service updated !' });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteUserService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.query;

  try {
    // check if user id valid
    if (!id) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    const response: Service | null = await deleteServiceOfUserService(
      Number(id),
    );

    if (!response) {
      res.status(401).json({
        success: false,
        message: "Couldn't delete service",
      });
      return;
    }

    res.status(200).json({ success: true, data: 'Service deleted !' });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
