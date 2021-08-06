import { Router } from "express";
import { body } from "express-validator";
import { validateRequet } from "../middlewares/validate-request";
import {
  createPost,
  deletePost,
  updatePost,
  getPosts,
} from "../controller/postController";
const router = Router();
router.get("/", getPosts);
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Title must be between 4 an 20 characters"),
    body("text")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Text must be between 4 an 20 characters"),
  ],
  validateRequet,
  createPost
);

router.patch(
  "/:id",
  [
    body("title")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Title must be between 4 an 20 characters"),
    body("text")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Text must be between 4 an 20 characters"),
  ],
  validateRequet,
  updatePost
);

router.delete("/:id", deletePost);

export { router as postRouter };
