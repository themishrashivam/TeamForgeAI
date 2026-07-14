import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },

    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending requests
joinRequestSchema.index(
  {
    project: 1,
    sender: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "pending",
    },
  }
);

const JoinRequest = mongoose.model(
  "JoinRequest",
  joinRequestSchema
);

export default JoinRequest;