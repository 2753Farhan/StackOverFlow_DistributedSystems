import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Post } from "../models/postSchema.js";
import { upload, handleFileUpload, handleCodeSnippet, minioClient } from "../utils/fileUtils.js";
import { createPostNotification } from "./notificationController.js";

// Controller to get the logged-in user's posts
export const getOwnPosts = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const posts = await Post.find({ postedBy: userId, expired: false });

  res.status(200).json({
    success: true,
    posts,
  });
});


// Controller to get posts by other users
export const getOtherPosts = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const posts = await Post.find({ postedBy: { $ne: userId }, expired: false });

  res.status(200).json({
    success: true,
    posts,
  });
});

// Controller to get a single post by the logged-in user
export const getMySinglePost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  const post = await Post.findOne({ _id: id, postedBy: req.user._id });

  if (!post) {
    return next(new ErrorHandler("Post not found or you are not the author", 404));
  }

  res.status(200).json({
    success: true,
    post,
  });
});

// Controller to get a single post by others (not created by the logged-in user)
export const getOtherSinglePost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  const post = await Post.findOne({ _id: id, postedBy: { $ne: req.user._id } });

  if (!post) {
    return next(new ErrorHandler("Post not found or it belongs to you", 404));
  }

  res.status(200).json({
    success: true,
    post,
  });
});


// Controller to create a new post
export const postPost = catchAsyncErrors(async (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler("File upload error", 400));
    }

    const { 
      title, 
      description, 
      uploadType, 
      codesnippet, 
      snippetFileType 
    } = req.body;

    if (!title || !description) {
      return next(new ErrorHandler("Please fill in all required fields", 400));
    }

    let fileurl = null;

    if (uploadType === 'file') {
      if (!req.file) {
        return next(new ErrorHandler("Please upload a file", 400));
      }
      fileurl = await handleFileUpload(req.file);
    } else if (uploadType === 'snippet') {
      if (!codesnippet || !snippetFileType) {
        return next(new ErrorHandler("Code snippet and file type are required", 400));
      }
      fileurl = await handleCodeSnippet(codesnippet, snippetFileType);
    } else {
      return next(new ErrorHandler("Invalid upload type", 400));
    }

    const post = await Post.create({
      title,
      description,
      expired: req.body.expired || false,
      jobPostedOn: req.body.jobPostedOn || Date.now(),
      postedBy: req.user._id,
      fileurl,
      codesnippet: uploadType === 'snippet' ? codesnippet : null,
    });

    await createPostNotification(req.user._id, post, 'new_post');

    res.status(201).json({
      success: true,
      message: "Your post was successfully created!",
      post,
    });
  });
});

// Controller to update the logged-in user's post
export const updateOwnPost = catchAsyncErrors(async (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler("File upload error", 400));
    }

    const { id } = req.params;
    const userId = req.user._id;
    const { uploadType, codesnippet, snippetFileType } = req.body;

    let post = await Post.findOne({ _id: id, postedBy: userId });
    if (!post) {
      return next(new ErrorHandler("Post not found or unauthorized", 404));
    }

    let fileurl = post.fileurl;
    if (post.fileurl) {
      const oldFilename = post.fileurl.split('/').pop();
      await minioClient.removeObject('test', oldFilename);
    }

    if (uploadType === 'file') {
      if (!req.file) return next(new ErrorHandler("Please upload a file", 400));
      fileurl = await handleFileUpload(req.file);
    } else if (uploadType === 'snippet') {
      if (!codesnippet || !snippetFileType) return next(new ErrorHandler("Code snippet and file type are required", 400));
      fileurl = await handleCodeSnippet(codesnippet, snippetFileType);
    }

    post = await Post.findByIdAndUpdate(id, { ...req.body, fileurl, codesnippet: uploadType === 'snippet' ? codesnippet : null }, {
      new: true, runValidators: true, useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  });
});

// Controller to delete the logged-in user's post
export const deleteOwnPost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await Post.findOne({ _id: id, postedBy: userId });
  if (!post) {
    return next(new ErrorHandler("Post not found or unauthorized", 404));
  }

  if (post.fileurl) {
    const filename = post.fileurl.split('/').pop();
    await minioClient.removeObject('test', filename);
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully!",
  });
});


// Download file attachment from a post
export const downloadFile = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  
  if (!post || !post.fileurl) {
    return next(new ErrorHandler("File not found", 404));
  }

  const filename = post.fileurl.split('/').pop();
  
  minioClient.getObject('test', filename, (error, stream) => {
    if (error) {
      return next(new ErrorHandler("File download failed", 500));
    }
    stream.pipe(res);
  });
});