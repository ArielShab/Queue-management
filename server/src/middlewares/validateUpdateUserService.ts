import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const updateUserServiceSchema = Joi.object({
  id: Joi.number().integer().required(),
  serviceName: Joi.string().required(),
});

export const validateUpdateUserService = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = updateUserServiceSchema.validate(req.body, {
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
