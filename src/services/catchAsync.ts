import { NextFunction, Request, Response } from "express";

type AsyncFun = (req: any, res: any, next: any) => Promise<void>;

export const catchAsync = (fn: AsyncFun) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
