import express from "express";
import {
  getOwnPosts,
  getOtherPosts,
  postPost,
  updateOwnPost,
  deleteOwnPost,
  getMySinglePost,
  getOtherSinglePost,
  downloadFile,
} from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/auth.js"; // Import your auth middleware

const router = express.Router();

// Apply the isAuthenticated middleware where needed
router.post("/post", isAuthenticated, postPost); // Create a new post
router.get("/posts/own", isAuthenticated, getOwnPosts); // Get all my posts
router.get("/posts/others", isAuthenticated, getOtherPosts); // Get all posts except mine

// Routes to get single posts
router.get("/post/my/:id", isAuthenticated, getMySinglePost);       // Get my single post
router.get("/post/others/:id", isAuthenticated, getOtherSinglePost); // Get other user's single post

router.put("/post/:id", isAuthenticated, updateOwnPost); // Update own post
router.delete("/post/:id", isAuthenticated, deleteOwnPost); // Delete own post

router.get("/downloadfile/:id", isAuthenticated, downloadFile); // Download file associated with a post

export default router;
