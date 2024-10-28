import express from "express";
import {
  getOwnPosts,
  getOtherPosts,
  getPosts,
  postPost,
  updateOwnPost,
  deleteOwnPost,
  getMySinglePost,
  getOtherSinglePost,
  getSinglePost,
  downloadFile,
} from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/auth.js"; // Import your auth middleware

const router = express.Router();

// Apply the isAuthenticated middleware where needed
router.post("/", isAuthenticated, postPost); // Create a new post
// router.get("/posts/own", isAuthenticated, getOwnPosts); // Get all my posts
// router.get("/posts/others", isAuthenticated, getOtherPosts); // Get all posts except mine
router.get("/", isAuthenticated, getPosts); // Create a new post
// Routes to get single posts

router.get("/:id", isAuthenticated,getSinglePost)
// router.get("/post/my/:id", isAuthenticated, getMySinglePost);       // Get my single post
// router.get("/post/others/:id", isAuthenticated, getOtherSinglePost); // Get other user's single post

// router.put("/post/:id", isAuthenticated, updateOwnPost); // Update own post
// router.delete("/post/:id", isAuthenticated, deleteOwnPost); // Delete own post

router.get("/downloadfile/:id", isAuthenticated, downloadFile); // Download file associated with a post

export default router;
