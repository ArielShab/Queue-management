import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const userDataSchema = Joi.object({
  id: Joi.number().integer(),
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().min(2).email(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  queueDuration: Joi.number(),
});

export const validateUserData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = userDataSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
