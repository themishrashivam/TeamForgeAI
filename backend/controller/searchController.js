import User from "../model/User.js";
import Project from "../model/Project.js";

export const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q?.trim()) {
      return res.json({
        success: true,
        users: [],
        projects: [],
      });
    }

    const regex = new RegExp(q, "i");

    const users = await User.find({
      $or: [
        { name: regex },
        { college: regex },
        { branch: regex },
        { skills: { $in: [regex] } },
      ],
    }).select("name profileImage skills college branch");

    const projects = await Project.find({
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { projectType: regex },
        { requiredSkills: { $in: [regex] } },
      ],
    }).populate("createdBy", "name");

    res.status(200).json({
      success: true,
      users,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};