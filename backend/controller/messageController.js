import Message from "../model/Message.js";
import Project from "../model/Project.js";
import User from "../model/User.js";

// =========================================================
// SEND MESSAGE
// =========================================================

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, projectId, message } = req.body;

    if (!receiverId || !projectId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver, project and message are required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const currentUserId = req.user._id.toString();
    const receiverUserId = receiverId.toString();

    const isSenderMember = project.teamMembers.some(
      (member) =>
        member.toString() === currentUserId
    );

    const isReceiverMember = project.teamMembers.some(
      (member) =>
        member.toString() === receiverUserId
    );

    if (!isSenderMember || !isReceiverMember) {
      return res.status(403).json({
        success: false,
        message:
          "Both users must be team members of this project",
      });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      project: projectId,
      message: message.trim(),
      isRead: false,
    });

    const populatedMessage =
      await Message.findById(newMessage._id)
        .populate(
          "sender",
          "name email profileImage"
        )
        .populate(
          "receiver",
          "name email profileImage"
        )
        .populate("project", "title");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.log("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================================================
// GET MESSAGES
// =========================================================

export const getMessages = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const currentUserId =
      req.user._id.toString();

    const isCurrentUserMember =
      project.teamMembers.some(
        (member) =>
          member.toString() === currentUserId
      );

    if (!isCurrentUserMember) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a member of this project",
      });
    }

    const isOtherUserMember =
      project.teamMembers.some(
        (member) =>
          member.toString() === userId.toString()
      );

    if (!isOtherUserMember) {
      return res.status(403).json({
        success: false,
        message:
          "User is not a member of this project",
      });
    }

    const messages = await Message.find({
      project: projectId,
      $or: [
        {
          sender: req.user._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user._id,
        },
      ],
    })
      .populate(
        "sender",
        "name email profileImage"
      )
      .populate(
        "receiver",
        "name email profileImage"
      )
      .populate("project", "title")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.log("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================================================
// GET CONVERSATIONS
// =========================================================

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .populate(
        "sender",
        "name email profileImage"
      )
      .populate(
        "receiver",
        "name email profileImage"
      )
      .populate("project", "title")
      .sort({ createdAt: -1 });

    const conversations = [];
    const conversationMap = new Map();

    for (const message of messages) {
      if (!message.project) {
        continue;
      }

      const otherUser =
        message.sender?._id?.toString() ===
        userId.toString()
          ? message.receiver
          : message.sender;

      if (!otherUser) {
        continue;
      }

      const key =
        `${message.project._id}_${otherUser._id}`;

      if (!conversationMap.has(key)) {
        conversationMap.set(key, true);

        const unreadCount =
          await Message.countDocuments({
            sender: otherUser._id,
            receiver: userId,
            project: message.project._id,
            isRead: false,
          });

        conversations.push({
          project: message.project,
          user: otherUser,
          lastMessage: message.message,
          lastMessageTime:
            message.createdAt,
          unreadCount,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.log(
      "Get Conversations Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================================================
// SEARCH MESSAGE MEMBERS
// =========================================================

export const searchMessageMembers = async (
  req,
  res
) => {
  try {
    const { q } = req.query;

    if (!q?.trim()) {
      return res.status(200).json({
        success: true,
        count: 0,
        members: [],
      });
    }

    const searchValue = q.trim();

    const currentUserId =
      req.user._id;

    // -----------------------------------------------------
    // 1. Find users by name/email
    // -----------------------------------------------------

    const users = await User.find({
      _id: {
        $ne: currentUserId,
      },
      $or: [
        {
          name: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ],
    })
      .select(
        "name email profileImage skills"
      )
      .limit(20);

    // -----------------------------------------------------
    // 2. Find projects where current user is a member
    // -----------------------------------------------------

    const myProjects =
      await Project.find({
        teamMembers: currentUserId,
      }).select(
        "_id title teamMembers"
      );

    // -----------------------------------------------------
    // 3. For every searched user, find common projects
    // -----------------------------------------------------

    const members = [];

    for (const user of users) {
      const commonProjects =
        myProjects
          .filter((project) =>
            project.teamMembers.some(
              (member) =>
                member.toString() ===
                user._id.toString()
            )
          )
          .map((project) => ({
            _id: project._id,
            title: project.title,
          }));

      // Only show users who share at least
      // one project with the current user.
      if (commonProjects.length > 0) {
        members.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImage:
            user.profileImage,
          skills: user.skills || [],
          projects: commonProjects,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.log(
      "Search Message Members Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================================================
// MARK MESSAGE AS READ
// =========================================================

export const markMessageRead = async (
  req,
  res
) => {
  try {
    const {
      projectId,
      userId,
    } = req.params;

    const project =
      await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember =
      project.teamMembers.some(
        (member) =>
          member.toString() ===
          req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a member of this project",
      });
    }

    await Message.updateMany(
      {
        project: projectId,
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Messages marked as read",
    });
  } catch (error) {
    console.log(
      "Mark Message Read Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================================================
// GET UNREAD MESSAGE COUNT
// =========================================================

export const getUnreadMessageCount = async (
  req,
  res
) => {
  try {
    const count =
      await Message.countDocuments({
        receiver: req.user._id,
        isRead: false,
      });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.log(
      "Unread Message Count Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};