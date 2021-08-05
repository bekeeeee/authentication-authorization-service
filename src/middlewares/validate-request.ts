import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequet = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //throw new error
  }
  next();
};
