import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // user receiving the notification
  content: { type: String, required: true }, // content of the notification
  isRead: { type: Boolean, default: false }, // whether the notification has been read
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
