import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: true
  },
  type: {
    type: String,
    enum: ['new_post', 'update_post', 'delete_post'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Notification = mongoose.model("Notification", notificationSchema)