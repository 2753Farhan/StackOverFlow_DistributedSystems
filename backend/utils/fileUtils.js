import { Client } from 'minio';
import multer from 'multer';
import ErrorHandler from "../middlewares/error.js";

// Configure MinIO client
export const minioClient = new Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});

// Configure multer for memory storage
export const upload = multer({ storage: multer.memoryStorage() });

// Helper function to handle file upload to MinIO
export const handleFileUpload = async (file) => {
  try {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    await minioClient.putObject('test', uniqueFileName, file.buffer);
    return `http://127.0.0.1:9001/browser/test/${uniqueFileName}`;
  } catch (error) {
    throw new ErrorHandler("File upload failed", 500);
  }
};

// Helper function to handle code snippet as file
export const handleCodeSnippet = async (codeSnippet, fileExtension) => {
  if (!codeSnippet) {
    throw new ErrorHandler("Code snippet cannot be empty", 400);
  }

  try {
    const uniqueFileName = `${Date.now()}-snippet.${fileExtension}`;
    const buffer = Buffer.from(codeSnippet);
    await minioClient.putObject('test', uniqueFileName, buffer);
    return `http://127.0.0.1:9001/browser/test/${uniqueFileName}`;
  } catch (error) {
    console.error("Error during file creation/upload:", error);
    throw new ErrorHandler("Code snippet file creation failed", 500);
  }
};
