import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthenticated } from "../errors/not-authenticated-error";
import { catchAsync } from "../services/catchAsync";

interface UserPayload {
  _id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUserMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
      throw new NotAuthenticated();
    }
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET!
    ) as UserPayload;
    req.currentUser = payload;

    next();
  }
);
