import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  isClient: Joi.boolean().required(),
});

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
