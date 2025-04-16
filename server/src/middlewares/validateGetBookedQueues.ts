import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const bookQueueSchema = Joi.object({
  id: Joi.string().required(),
  isClient: Joi.boolean().required(),
});

export const validateGetBookedQueues = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = bookQueueSchema.validate(req.query, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
