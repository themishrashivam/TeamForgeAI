import User from "../model/User.js";
import Project from "../model/Project.js";

export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const projectsCount = await Project.countDocuments({
      createdBy: user._id,
    });

    const myProjects = await Project.find({
      createdBy: user._id,
    });

    const teamMembersCount = myProjects.reduce(
      (sum, project) =>
        sum + (project.teamMembers?.length || 0),
      0
    );

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        projectsCount,
        teamMembersCount,
        requestsSent: 0,
        requestsReceived: 0,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      bio,
      location,
      phone,
      github,
      linkedin,
      portfolio,
      college,
      branch,
      year,
      profileImage,
      skills,
      education
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (college !== undefined) user.college = college;
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year;
    if (profileImage !== undefined) user.profileImage = profileImage;

    if (skills) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map(skill => skill.trim());
    }
    if (education) {
      user.education = education;
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.log("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};