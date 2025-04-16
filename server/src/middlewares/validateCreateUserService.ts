import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const createUserServiceSchema = Joi.object({
  userId: Joi.number().integer().required(),
  serviceName: Joi.string().required(),
});

export const validateCreateUserService = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = createUserServiceSchema.validate(req.body, {
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
