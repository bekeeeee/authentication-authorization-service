import { Router } from "express";
import { body } from "express-validator"; // body is a middleware for error handling
import { validateRequet } from "../middlewares/validate-request";
import { signup } from "../controller/authController";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 an 20 characters"),
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be between 4 an 20 characters"),
  ],
  validateRequet,
  signup
);

export { router as userRouter };
