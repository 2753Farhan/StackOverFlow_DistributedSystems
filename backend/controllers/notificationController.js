import { User } from '../models/userSchema.js'; // Adjusted import to match named export
import Notification from '../models/notificationSchema.js'; // Import Notification model
import { io } from '../app.js'; // Access Socket.IO instance

// Function to create notifications for all users except the poster
export const createNotification = async (req, res) => {
  const { postId, postContent } = req.body;
  const senderId = req.user.id; // Assuming user ID is available in req.user

  try {
    // Fetch all users except the sender
    const users = await User.find({ _id: { $ne: senderId } });

    // Create a notification for each user
    const notifications = users.map(user => ({
      userId: user._id,
      content: `New post created: ${postContent}`, // Customize the message
    }));

    // Save notifications in bulk
    await Notification.insertMany(notifications);

    // Emit real-time notification using Socket.IO
    users.forEach(user => {
      io.to(user._id.toString()).emit('newNotification', {
        content: `New post created: ${postContent}`,
        postId: postId,
      });
    });

    res.status(201).json({ message: 'Notifications sent to all users except the sender' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending notifications', error });
  }
};

// Function to mark notification as read and delete it for the specific user
export const markAsReadAndDelete = async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  try {
    await Notification.findOneAndDelete({ _id: notificationId, userId });
    res.status(200).json({ message: 'Notification marked as read and deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};
