import { Response, Request, NextFunction } from "express";
import { Post } from "../models/PostModel";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { catchAsync } from "../services/catchAsync";

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const { text } = req.body;
  const userId = req.currentUser?._id;
  const post = Post.build({ text, user:userId });
  await post.save();

  res.status(201).json({ post });
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { text } = req.body;
  let post = await Post.findById(req.params.id);
  if (!post) {
    throw new BadRequestError("Post not found");
  }
  const userId = req.currentUser?._id;

  if (userId != post?.user.id) {
    throw new NotAuthorizedError();
  }
  // const existPost = await Post.findById(req.params.id);
  post = await Post.findByIdAndUpdate(
    req.params.id,
    { text },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ post });
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    throw new BadRequestError("Post not found");
  }
  const userId = req.currentUser?._id;

  if (userId == post?.user._id || req.currentUser?.role === "admin") {
    post = await Post.findByIdAndDelete(req.params.id);

    res.status(201).json({ status: "success", post });
  } else {
    throw new NotAuthorizedError();
  }
});

export const getPosts = catchAsync(async (req: Request, res: Response) => {
  const posts = await Post.find().sort({ _id: -1 }).exec();
  res.status(200).json({ posts });
});
