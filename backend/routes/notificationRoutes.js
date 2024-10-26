import express from "express";
import {
  createNotification,
  getNotifications,
  markAsReadAndDelete,
} from "../controllers/notificationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to create a notification when a user posts
router.post("/notify", isAuthenticated, createNotification);

// Route to get all notifications for the authenticated user
router.get("/getall", isAuthenticated, getNotifications);

// Route to mark a specific notification as read and delete it from the user's view
router.delete("/delete/:notificationId", isAuthenticated, markAsReadAndDelete);

export default router;
