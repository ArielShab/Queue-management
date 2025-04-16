import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const workingDaySchema = Joi.object({
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

export const validateWorkingDay = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = workingDaySchema.validate(req.body, {
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
