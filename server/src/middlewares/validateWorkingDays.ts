import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const workingDaysSchema = Joi.object({
  id: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  day: Joi.string()
    .valid(
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    )
    .required(),
  opening: Joi.string().required(),
  closing: Joi.string().required(),
});

export const validateWorkingDays = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = workingDaysSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
