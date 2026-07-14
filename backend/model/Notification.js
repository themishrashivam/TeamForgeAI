import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: String,

    message: String,

    type: {
      type: String,
      enum: [
        "join_request",
        "request_accepted",
        "request_rejected",
        "team_joined",
      ],
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);