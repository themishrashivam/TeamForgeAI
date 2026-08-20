import Notification from "../model/Notification.js";
import JoinRequest from "../model/JoinRequest.js";
import Project from "../model/Project.js";

export const sendJoinRequest = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You are already the owner",
      });
    }

    const alreadyMember = project.teamMembers?.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "Already a team member",
      });
    }

    const existingRequest =
      await JoinRequest.findOne({
        project: projectId,
        sender: req.user._id,
        status: "pending",
      });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already sent",
      });
    }

    const request = await JoinRequest.create({
      project: projectId,
      sender: req.user._id,
      receiver: project.createdBy,
      status: "pending",
    });

    const notification = await Notification.create({
      user: project.createdBy,
      title: "New Join Request",
      message: `${req.user.name} wants to join ${project.title}`,
      type: "join_request",
      isRead: false,
    });

    console.log("Join Request Created:", request._id);
    console.log("Notification Created:", notification._id);
    console.log("Notification Receiver:", notification.user);

    return res.status(201).json({
      success: true,
      message: "Join request sent successfully",
      request,
      notification,
    });
  } catch (error) {
    console.log("Send Request Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectRequests = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const requests =
      await JoinRequest.find({
        project: projectId,
        status: "pending",
      }).populate(
        "sender",
        "name email skills bio profileImage"
      );

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.log("Get Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const acceptJoinRequest = async (req, res) => {
  try {
    const request =
      await JoinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const project = await Project.findById(
      request.project
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    request.status = "accepted";
    await request.save();

    const exists = project.teamMembers.some(
      (member) =>
        member.toString() ===
        request.sender.toString()
    );

    if (!exists) {
      project.teamMembers.push(request.sender);
      await project.save();
    }

    await Notification.create({
      user: request.sender,
      title: "Request Accepted",
      message: `Your request to join ${project.title} has been accepted`,
      type: "request_accepted",
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
    });
  } catch (error) {
    console.log("Accept Request Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectJoinRequest = async (req, res) => {
  try {
    const request =
      await JoinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const project = await Project.findById(
      request.project
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    request.status = "rejected";
    await request.save();

    await Notification.create({
      user: request.sender,
      title: "Request Rejected",
      message: `Your request to join ${project.title} has been rejected`,
      type: "request_rejected",
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
    });
  } catch (error) {
    console.log("Reject Request Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    console.log("================================");
    console.log("Logged User ID:", req.user._id);

    const requests =
      await JoinRequest.find({
        receiver: req.user._id,
        status: "pending",
      })
        .populate(
          "sender",
          "name email profileImage skills bio"
        )
        .populate(
          "project",
          "title description category"
        );

    console.log(
      "Requests Found:",
      requests.length
    );

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.log(
      "Get Received Requests Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};