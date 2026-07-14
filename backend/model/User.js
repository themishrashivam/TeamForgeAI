import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Profile
    bio: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },

    // Education
    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    // Social Links
    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    // Skills
    skills: [
      {
        type: String,
      },
    ],

    // Stats (optional for demo)
    projectsCount: {
      type: Number,
      default: 0,
    },

    requestsSent: {
      type: Number,
      default: 0,
    },

    requestsReceived: {
      type: Number,
      default: 0,
    },

    teamMembersCount: {
      type: Number,
      default: 0,
    },

    // Education Timeline
    education: [
      {
        degree: String,
        institute: String,
        duration: String,
        score: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;