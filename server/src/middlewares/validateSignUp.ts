import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const userSchema = Joi.object({
  fieldsValues: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(2).email().required(),
    phone: Joi.string()
      .pattern(/^0\d{8,9}$/)
      .optional(),
    queueDuration: Joi.number().required(),
  }).required(),
  workingDays: Joi.array().items(
    Joi.object({
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
    }).required(),
  ),
});

export const validateSignUp = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
