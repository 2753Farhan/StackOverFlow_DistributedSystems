import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Notification } from "../models/notificationSchema.js";
import { User } from "../models/userSchema.js";

// Get all notifications for current user
export const getNotifications = catchAsyncErrors(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'name')
    .populate('post', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    notifications,
  });
});

// Create notification for new post
export const createPostNotification = async (sender, post, type) => {
  try {
    // Get all users except sender
    const users = await User.find({ _id: { $ne: sender } });
    
    // Create notifications
    const notifications = users.map(user => ({
      recipient: user._id,
      sender,
      post: post._id,
      type
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit socket event for real-time notification
 

    return createdNotifications;
  } catch (error) {
    console.error('Error creating notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = catchAsyncErrors(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  notification.read = true;
  await notification.save();


});

// Delete notification
export const deleteNotification = catchAsyncErrors(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  await notification.deleteOne();

  // Emit socket event
 
  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});