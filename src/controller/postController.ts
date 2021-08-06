import { Response, Request, NextFunction } from "express";
import { Post } from "../models/PostModel";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { catchAsync } from "../services/catchAsync";

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const { title, text } = req.body;
  const userId = req.currentUser?.id;
  const post = Post.build({ title, text, userId });
  await post.save();

  res.status(201).json({ post });
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  console.log("Update post...");
  const { title, text } = req.body;
  let post = await Post.findById(req.params.id);
  const userId = req.currentUser?.id;
  console.log("userId", userId);
  console.log("post", post?.userId);

  if (userId != post?.userId) {
    console.log("Not authorized");

    throw new NotAuthorizedError();
  }
  console.log("postId", req.params.id);
  // const existPost = await Post.findById(req.params.id);
  post = await Post.findByIdAndUpdate(
    req.params.id,
    { text, title },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({ post });
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  console.log("Deleting a post...");
  console.log("currentUser", req.currentUser);
  let post = await Post.findById(req.params.id);
  if (!post) {
    throw new BadRequestError("Post not found");
  }
  const userId = req.currentUser?.id;
  console.log("userId", userId);
  console.log("postOwner", post?.userId);

  if (userId == post?.userId || req.currentUser?.role === "admin") {
    console.log("postId", req.params.id);
    post = await Post.findByIdAndDelete(req.params.id);

    res.status(201).json({ post });
  } else {
    throw new NotAuthorizedError();
  }
});

export const getPosts = catchAsync(async (req: Request, res: Response) => {
  console.log("getPosts");
  const posts = await Post.find();
  res.status(200).json({ posts });
});
