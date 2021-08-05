import { NextFunction, Response, Request } from "express";

import { CustomerError } from "../errors/custome-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log("error handling")
  if (err instanceof CustomerError) {
    console.log("statusCode", err.statusCode);
    console.log("handling this error as a request validation error");
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
