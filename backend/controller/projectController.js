import Project from "../model/Project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      requiredSkills,
      githubLink,
    } = req.body;

    if (
      !title ||
      !description ||
      !requiredSkills
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const project = await Project.create({
      title,
      description,
      image,
      requiredSkills,
      githubLink,
      createdBy: req.user._id,
      teamMembers: [req.user._id],
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log("Create Project Error:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate(
        "createdBy",
        "name email profileImage skills bio"
      )
      .populate(
        "teamMembers",
        "name email profileImage skills bio"
      );

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.log("Get All Projects Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        {
          createdBy: req.user._id,
        },
        {
          teamMembers: req.user._id,
        },
      ],
    })
      .populate(
        "createdBy",
        "name email profileImage skills bio"
      )
      .populate(
        "teamMembers",
        "name email profileImage skills bio"
      );

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.log("Get My Projects Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    )
      .populate(
        "createdBy",
        "name email profileImage skills bio"
      )
      .populate(
        "teamMembers",
        "name email profileImage skills bio"
      );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      project,
    });
  } catch (error) {
    console.log("Get Project Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

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
        message:
          "Only project owner can edit the project",
      });
    }

    const {
      title,
      description,
      image,
      category,
      projectType,
      visibility,
      requiredSkills,
      status,
      githubLink,
    } = req.body;

    if (title !== undefined) {
      project.title = title;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (image !== undefined) {
      project.image = image;
    }

    if (category !== undefined) {
      project.category = category;
    }

    if (projectType !== undefined) {
      project.projectType = projectType;
    }

    if (visibility !== undefined) {
      project.visibility = visibility;
    }

    if (requiredSkills !== undefined) {
      project.requiredSkills = requiredSkills;
    }

    if (status !== undefined) {
      project.status = status;
    }

    if (githubLink !== undefined) {
      project.githubLink = githubLink;
    }

    await project.save();

    const updatedProject =
      await Project.findById(id)
        .populate(
          "createdBy",
          "name email profileImage skills bio"
        )
        .populate(
          "teamMembers",
          "name email profileImage skills bio"
        );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.log(
      "Update Project Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

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
        message:
          "Only project owner can delete the project",
      });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(
      "Delete Project Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const removeTeamMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(
      projectId
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
        message:
          "Only project owner can remove members",
      });
    }

    if (
      project.createdBy.toString() ===
      userId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project owner cannot be removed",
      });
    }

    const isMember =
      project.teamMembers.some(
        (member) =>
          member.toString() === userId.toString()
      );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message:
          "User is not a team member",
      });
    }

    project.teamMembers =
      project.teamMembers.filter(
        (member) =>
          member.toString() !== userId.toString()
      );

    await project.save();

    res.status(200).json({
      success: true,
      message:
        "Team member removed successfully",
      project,
    });
  } catch (error) {
    console.log(
      "Remove Team Member Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const leaveProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(
      projectId
    );

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
        message:
          "Project owner cannot leave the project",
      });
    }

    const isMember =
      project.teamMembers.some(
        (member) =>
          member.toString() ===
          req.user._id.toString()
      );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message:
          "You are not a team member",
      });
    }

    project.teamMembers =
      project.teamMembers.filter(
        (member) =>
          member.toString() !==
          req.user._id.toString()
      );

    await project.save();

    res.status(200).json({
      success: true,
      message:
        "You left the project successfully",
    });
  } catch (error) {
    console.log(
      "Leave Project Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};