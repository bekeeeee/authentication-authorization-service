import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/passwordHandler";
import { catchAsync } from "../services/catchAsync";
import { User } from "../models/UserModel";

interface jwtData {
  _id: string;
  username: string;
  role: string;
}
const signToken = (data: jwtData) => {
  return jwt.sign({ ...data }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username, role } = req.body;
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      throw new BadRequestError("Email in use");
    }

    if (existingUsername) {
      throw new BadRequestError("Username in use");
    }

    const user = User.build({ email, password, username, role });
    await user.save();

    // Generate JWT
    const userJwt = await signToken({
      _id: user._id,
      username: user.username,
      role: user.role,
    });

    // store it on a seesion
    req.session = {
      jwt: userJwt,
    };
    user.password = "";
    res.status(201).json({ currentUser: user });
  }
);

const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email }).select("+password");
  if (!currentUser) {
    throw new BadRequestError("Invalid credentials");
  }

  const passwordsMatch = await Password.compare(currentUser.password, password);

  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials");
  }
  // Generate JWT

  const userJwt = signToken({
    _id: currentUser.id,
    username: currentUser.username,
    role: currentUser.role,
  });
  // store it on a seesion
  req.session = {
    jwt: userJwt,
  };

  currentUser.password = "";
  res.status(200).json({ currentUser });
});

const currentUser = catchAsync(async (req: Request, res: Response) => {
  res.json({ currentUser: req.currentUser || null });
});

const signout = catchAsync(async (req: Request, res: Response) => {
  req.session = null;
  res.status(200).json({ status: "success" });
});
export { signup, signin, currentUser, signout };
