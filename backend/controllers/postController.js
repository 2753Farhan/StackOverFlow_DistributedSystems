import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Post } from "../models/postSchema.js";
import { Client } from 'minio';
import multer from 'multer';

// Configure MinIO client
const minioClient = new Client({
  endPoint: '10.100.200.133',
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

// Helper function to handle code snippet as file
const handleCodeSnippet = async (codeSnippet, fileExtension) => {
  if (!codeSnippet) {
    throw new ErrorHandler("Code snippet cannot be empty", 400);
  }
  
  try {
    const uniqueFileName = `${Date.now()}-snippet.${fileExtension}`;
    const buffer = Buffer.from(codeSnippet);
    await minioClient.putObject('test', uniqueFileName, buffer);
    return `minio://test/${uniqueFileName}`;
  } catch (error) {
    console.error("Error during file creation/upload:", error);
    throw new ErrorHandler("Code snippet file creation failed", 500);
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

// Create a new post with mutually exclusive file/snippet support
export const postPost = catchAsyncErrors(async (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler("File upload error", 400));
    }

    const { 
      title, 
      description, 
      uploadType, // 'file' or 'snippet'
      codesnippet, 
      snippetFileType 
    } = req.body;

    if (!title || !description) {
      return next(new ErrorHandler("Please fill in all the required fields", 400));
    }

    if (!uploadType) {
      return next(new ErrorHandler("Please specify upload type (file or snippet)", 400));
    }

    let fileurl = null;

    // Handle based on upload type
    if (uploadType === 'file') {
      if (!req.file) {
        return next(new ErrorHandler("Please upload a file", 400));
      }
      fileurl = await handleFileUpload(req.file);
      
    } else if (uploadType === 'snippet') {
      if (!codesnippet || !snippetFileType) {
        return next(new ErrorHandler("Code snippet and file type are required", 400));
      }

      // Validate file extension
      const validExtensions = ['js', 'py', 'java', 'cpp', 'txt', 'html', 'css', 'json'];
      if (!validExtensions.includes(snippetFileType)) {
        return next(new ErrorHandler("Invalid file type for code snippet", 400));
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

    res.status(201).json({
      success: true,
      message: "Your post was successfully created!",
      post,
    });
  });
});

// Update post with mutually exclusive file/snippet support
export const updatePost = catchAsyncErrors(async (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler("File upload error", 400));
    }

    const { id } = req.params;
    const { 
      uploadType,
      codesnippet, 
      snippetFileType 
    } = req.body;
    
    let post = await Post.findById(id);
    
    if (!post) {
      return next(new ErrorHandler("OOPS! Post not found", 404));
    }

    let fileurl = post.fileurl;

    // Delete existing file if it exists
    if (post.fileurl) {
      const oldFilename = post.fileurl.split('/').pop();
      try {
        await minioClient.removeObject('test', oldFilename);
      } catch (error) {
        console.error('Error deleting old file:', error);
      }
    }

    // Handle based on upload type
    if (uploadType === 'file') {
      if (!req.file) {
        return next(new ErrorHandler("Please upload a file", 400));
      }
      fileurl = await handleFileUpload(req.file);
      
    } else if (uploadType === 'snippet') {
      if (!codesnippet || !snippetFileType) {
        return next(new ErrorHandler("Code snippet and file type are required", 400));
      }

      // Validate file extension
      const validExtensions = ['js', 'py', 'java', 'cpp', 'txt', 'html', 'css', 'json'];
      if (!validExtensions.includes(snippetFileType)) {
        return next(new ErrorHandler("Invalid file type for code snippet", 400));
      }

      fileurl = await handleCodeSnippet(codesnippet, snippetFileType);
    }

    post = await Post.findByIdAndUpdate(
      id,
      { 
        ...req.body,
        fileurl,
        codesnippet: uploadType === 'snippet' ? codesnippet : null
      },
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

// Other controller methods remain the same...

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