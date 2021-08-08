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
    body("text")
      .trim()
      .isLength({ min: 4, max: 100 })
      .withMessage("Text must be between 4 an 100 characters"),
  ],
  validateRequet,
  createPost
);

router.patch(
  "/:id",
  [
    body("text")
      .trim()
      .isLength({ min: 4, max: 100 })
      .withMessage("Text must be between 4 an 100 characters"),
  ],
  validateRequet,
  updatePost
);

router.delete("/:id", deletePost);

export { router as postRouter };
