import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Post } from "../models/postSchema.js";

// Get all jobs (not expired)
export const getAllPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({ expired: false });
  res.status(200).json({
    success: true,
    posts,
  });
});

// Create a new post
export const postPost = catchAsyncErrors(async (req, res, next) => {
  const { title, description, fileurl, codesnippet } = req.body;

  // Ensure required fields are present
  if (!title || !description) {
    return next(new ErrorHandler("Please fill in all the required fields", 400));
  }

  // Create a new post with the authenticated user's ID as `postedBy`
  const post = await Post.create({
    title,
    description,
    expired: req.body.expired || false,
    jobPostedOn: req.body.jobPostedOn || Date.now(),
    postedBy: req.user._id,  // Authenticated user's ID from req.user
    fileurl,
    codesnippet,
  });

  res.status(201).json({
    success: true,
    message: "Your post was successfully created!",
    post,
  });
});

// Update an existing post
export const updatePost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) {
    return next(new ErrorHandler("OOPS! Post not found", 404));
  }

  post = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
  });
});

// Delete a post
export const deletedPost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  await post.deleteOne();
  res.status(200).json({
    success: true,
    message: "Post deleted successfully!",
  });
});

// Get a single post
export const getSinglePost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  res.status(200).json({
    success: true,
    post,
  });
});
