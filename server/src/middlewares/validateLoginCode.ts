import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const loginCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
  isClient: Joi.boolean().required(),
});

export const validateLoginCode = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = loginCodeSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
