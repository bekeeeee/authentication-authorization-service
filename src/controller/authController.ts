import { Response, Request } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";

import { User } from "../models/UserModel";

const signup = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  console.log("Creating a user...");
  const existingEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });

  if (existingEmail) {
    // console.log("Email in use");
    throw new BadRequestError("Email in use");
  }

  if (existingUsername) {
    // console.log("Username in use");
    throw new BadRequestError("Username in use");
  }

  const user = User.build({ email, password, username });
  await user.save();

  // Generate JWT

  const userJwt = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_KEY!,
    {
      expiresIn: 55 * 252 * 5452 * 5254,
    }
  );

  // console.log("cookie", res.cookies.jwt);
  // store it on a seesion
  req.session = {
    jwt: userJwt,
  };
  user.password = " ";
  // console.log("cookie", res.cookies.jwt);

  res.status(201).send({ user, userJwt });
};

export { signup };
