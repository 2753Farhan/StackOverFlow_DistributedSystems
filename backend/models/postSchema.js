import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title."],
        minLength: [3, "Title must contain at least 3 Characters!"],
        maxLength: [30, "Title cannot exceed 30 Characters!"],
      },
    description: {
        type: String,
        required: [true, "Please provide decription."],
        minLength: [2, "Description must contain at least 2 Characters!"],
        maxLength: [500, "Description cannot exceed 500 Characters!"],
      },
    expired: {
        type: Boolean,
        default: false,
      },
    jobPostedOn: {
        type: Date,
        default: Date.now,
      },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    fileurl: {
        type: String
      },
    codesnippet: {
        type: String
      }
    
    
}
)
export const Post = mongoose.model("Post", postSchema);
