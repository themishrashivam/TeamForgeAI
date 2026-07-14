import Project from "../model/Project.js";
import Request from "../model/JoinRequest.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // My Projects
    const myProjects = await Project.find({
      createdBy: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Total Projects
    const totalProjects =
      await Project.countDocuments({
        createdBy: userId,
      });

    // Team Members Count
    const totalTeamMembers =
      myProjects.reduce(
        (count, project) =>
          count +
          (project.teamMembers?.length || 0),
        0
      );

    // Requests Sent
    const requestsSent =
      await Request.countDocuments({
        sender: userId,
        status: "pending",
      });

    // Requests Received
    const requestsReceived =
      await Request.countDocuments({
        receiver: userId,
        status: "pending",
      });

    // Team Invites
    const invites =
      await Request.find({
        receiver: userId,
        status: "pending",
      })
        .populate(
          "sender",
          "name profileImage"
        )
        .populate(
          "project",
          "title"
        );

    // Recommended Projects
    const recommendedProjects =
      await Project.find({
        createdBy: { $ne: userId },
      })
        .populate(
          "createdBy",
          "name"
        )
        .sort({ createdAt: -1 })
        .limit(6);

    res.status(200).json({
      success: true,

      stats: {
        totalProjects,
        totalTeamMembers,
        requestsSent,
        requestsReceived,
      },

      myProjects,
      invites,
      recommendedProjects,
    });
  } catch (error) {
    console.log(
      "Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};