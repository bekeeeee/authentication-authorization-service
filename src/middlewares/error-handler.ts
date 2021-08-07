import { NextFunction, Response, Request } from "express";

import { CustomerError } from "../errors/custome-error";
import {
  sendErrorDev,
  sendErrorProd,
  handleJWTError,
  handleJWTExpiredError,
  handleCastErrorDB,
} from "../controller/errorController";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err instanceof CustomerError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
    // console.log("errName", err);
  }
};
