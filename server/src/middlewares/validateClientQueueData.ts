import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const clientQueueDataSchema = Joi.object({
  clientName: Joi.string().required(),
  clientEmail: Joi.string().email().required(),
  queueTime: Joi.string().required(),
  serviceId: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
});

export const validateClientQueueData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = clientQueueDataSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
