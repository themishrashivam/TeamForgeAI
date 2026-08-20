import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Review", "Done"],
      default: "Todo",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    deadline: {
      type: Date,
      default: null,
    },

    estimatedHours: {
      type: Number,
      default: 0,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    labels: [
      {
        type: String,
        trim: true,
      },
    ],

    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],

    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);