import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
    },

    category: {
      type: String,
      default: "Web App",
    },

    projectType: {
      type: String,
      default: "Hackathon",
    },

    visibility: {
      type: String,
      default: "Public",
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      default: "Active",
    },

    githubLink: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;