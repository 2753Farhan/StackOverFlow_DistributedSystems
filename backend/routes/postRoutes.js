import express from "express";
import { getAllPosts, postPost, updatePost, deletedPost, getSinglePost } from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/auth.js"; // Import your auth middleware

const router = express.Router();

// Apply the isAuthenticated middleware where needed
router.post("/post", isAuthenticated, postPost); // Protecting the post route
router.get("/getall", isAuthenticated, getAllPosts); // Example of protecting another route
router.post("/update/:id", isAuthenticated, updatePost); // Adjust as needed
router.post("/delete/:id", isAuthenticated, deletedPost); // Adjust as needed
router.get("/:id", isAuthenticated, getSinglePost); // Adjust as needed

export default router;
