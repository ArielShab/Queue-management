import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const providerQueuesSchema = Joi.object({
  userId: Joi.string().required(),
  day: Joi.string().required(),
  date: Joi.string().required(),
});

export const validateProviderQueues = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = providerQueuesSchema.validate(req.query, {
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
