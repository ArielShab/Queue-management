import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const idSchema = Joi.object({
  id: Joi.string().required(),
});

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { error } = idSchema.validate(req.query, { abortEarly: false });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details.map((detail: any) => detail.message).join(', '),
    });
  }

  next();
};
