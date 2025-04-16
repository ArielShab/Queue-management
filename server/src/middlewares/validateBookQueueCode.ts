import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const bookQueueSchema = Joi.object({
  queueTime: Joi.string().required(),
  userId: Joi.number().integer().required(),
  verificationCode: Joi.string().required(),
});

export const validateBookQueueCode = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = bookQueueSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
