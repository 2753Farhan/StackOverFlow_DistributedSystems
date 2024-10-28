import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  getNotifications,
  markAsRead,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', isAuthenticated, getNotifications);
// router.put('/:id/read', isAuthenticated, markAsRead);
router.delete('/:id', isAuthenticated, deleteNotification);

export default router;