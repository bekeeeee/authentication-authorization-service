import { NextFunction, Response, Request } from "express";

import { CustomerError } from "../errors/custome-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomerError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }


  res.status(400).json({
    errors: [{ message: "Something went wrong" }],
  });
};
