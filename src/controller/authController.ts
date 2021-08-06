import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/passwordHandler";
import { catchAsync } from "../services/catchAsync";
import { User } from "../models/UserModel";

interface jwtData {
  id: string;
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
    console.log("Creating a user...");

    const { email, password, username } = req.body;
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      throw new BadRequestError("Email in use");
    }

    if (existingUsername) {
      throw new BadRequestError("Username in use");
    }

    const user = User.build({ email, password, username });
    await user.save();

    // Generate JWT
    const userJwt = await signToken({
      id: user._id,
      username: user.username,
      role: user.role,
    });

    // store it on a seesion
    req.session = {
      jwt: userJwt,
    };
    user.password = "";
    res.status(201).send({ user, userJwt });
  }
);

const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }
  console.log("sigin ...");

  const passwordsMatch = await Password.compare(
    existingUser.password,
    password
  );

  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials");
  }
  // Generate JWT

  const userJwt = signToken({
    id: existingUser.id,
    username: existingUser.username,
    role: existingUser.role,
  });
  // store it on a seesion
  req.session = {
    jwt: userJwt,
  };

  existingUser.password = "";
  res.status(200).send({ existingUser });
});

const currentUser = catchAsync(async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

const signout = catchAsync(async (req: Request, res: Response) => {
  req.session = null;
  res.status(200).json({ status: "success" });
});
export { signup, signin, currentUser, signout };
