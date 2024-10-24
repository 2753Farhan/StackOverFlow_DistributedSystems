import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Post } from "../models/postSchema.js";
import { Client } from 'minio';
import multer from 'multer';

// Configure MinIO client
const minioClient = new Client({
  endPoint: '10.100.201.32',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to handle file upload to MinIO
const handleFileUpload = async (file) => {
  try {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    await minioClient.putObject('test', uniqueFileName, file.buffer);
    return `minio://test/${uniqueFileName}`;
  } catch (error) {
    throw new ErrorHandler("File upload failed", 500);
  }
};

// Get all posts (not expired)
export const getAllPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({ expired: false });
  res.status(200).json({
    success: true,
    posts,
  });
});

// Create a new post with file support
export const postPost = catchAsyncErrors(async (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler("File upload error", 400));
    }

    const { title, description, codesnippet } = req.body;

    if (!title || !description) {
      return next(new ErrorHandler("Please fill in all the required fields", 400));
    }

    let fileurl;
    if (req.file) {
      fileurl = await handleFileUpload(req.file);
    }

    const post = await Post.create({
      title,
      description,
      expired: req.body.expired || false,
      jobPostedOn: req.body.jobPostedOn || Date.now(),
      postedBy: req.user._id,
      fileurl,
      codesnippet,
    });

    res.status(201).json({
      success: true,
      message: "Your post was successfully created!",
      post,
    });
  });
});

// Update post with file support
export const updatePost = catchAsyncErrors(async (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler("File upload error", 400));
    }

    const { id } = req.params;
    let post = await Post.findById(id);
    
    if (!post) {
      return next(new ErrorHandler("OOPS! Post not found", 404));
    }

    let fileurl = post.fileurl;
    if (req.file) {
      fileurl = await handleFileUpload(req.file);
    }

    post = await Post.findByIdAndUpdate(
      id,
      { ...req.body, fileurl },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  });
});

// Delete a post and its associated file
export const deletedPost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  // Delete associated file if it exists
  if (post.fileurl) {
    const filename = post.fileurl.split('/').pop();
    try {
      await minioClient.removeObject('test', filename);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
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