import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
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

export const currentUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("currentuser middleware");

  if (!req.session?.jwt) {
    console.log("not session");

    return res.send({ currentUser: null });
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET!
    ) as UserPayload;

    console.log("payload", payload);
    req.currentUser = payload;
  } catch (err) {
    console.log("err", err);
  }

  next();
};
