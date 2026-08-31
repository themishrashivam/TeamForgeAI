import Project from "../model/Project.js";
import User from "../model/User.js";
import { recommendTeamMembersWithAI } from "../ai/aiService.js";

const populateProject = (query) => {
  return query
    .populate(
      "createdBy",
      "name email profileImage skills bio branch year"
    )
    .populate(
      "teamMembers",
      "name email profileImage skills bio branch year"
    );
};

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
      !title?.trim() ||
      !description?.trim() ||
      !Array.isArray(requiredSkills)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and required skills are required",
      });
    }

    const cleanedSkills = requiredSkills
      .filter(
        (skill) =>
          typeof skill === "string"
      )
      .map((skill) => skill.trim())
      .filter(Boolean);

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      image: image?.trim() || "",
      requiredSkills: cleanedSkills,
      githubLink: githubLink?.trim() || "",
      createdBy: req.user._id,
      teamMembers: [req.user._id],
    });

    const populatedProject =
      await populateProject(
        Project.findById(project._id)
      );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.log(
      "Create Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllProjects = async (
  req,
  res
) => {
  try {
    const projects =
      await populateProject(
        Project.find()
      );

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.log(
      "Get All Projects Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyProjects = async (
  req,
  res
) => {
  try {
    const projects =
      await populateProject(
        Project.find({
          $or: [
            {
              createdBy: req.user._id,
            },
            {
              teamMembers: req.user._id,
            },
          ],
        })
      );

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.log(
      "Get My Projects Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getSingleProject = async (
  req,
  res
) => {
  try {
    const project =
      await populateProject(
        Project.findById(req.params.id)
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.log(
      "Get Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProject = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const project =
      await Project.findById(id);

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
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Project title cannot be empty",
        });
      }

      project.title = title.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Project description cannot be empty",
        });
      }

      project.description =
        description.trim();
    }

    if (image !== undefined) {
      project.image =
        typeof image === "string"
          ? image.trim()
          : "";
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
      if (
        !Array.isArray(requiredSkills)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Required skills must be an array",
        });
      }

      project.requiredSkills =
        requiredSkills
          .filter(
            (skill) =>
              typeof skill === "string"
          )
          .map((skill) => skill.trim())
          .filter(Boolean);
    }

    if (status !== undefined) {
      project.status = status;
    }

    if (githubLink !== undefined) {
      project.githubLink =
        typeof githubLink === "string"
          ? githubLink.trim()
          : "";
    }

    await project.save();

    const updatedProject =
      await populateProject(
        Project.findById(id)
      );

    return res.status(200).json({
      success: true,
      message:
        "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.log(
      "Update Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteProject = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const project =
      await Project.findById(id);

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

    return res.status(200).json({
      success: true,
      message:
        "Project deleted successfully",
    });
  } catch (error) {
    console.log(
      "Delete Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const removeTeamMember = async (
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
          member.toString() ===
          userId.toString()
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
          member.toString() !==
          userId.toString()
      );

    await project.save();

    const updatedProject =
      await populateProject(
        Project.findById(projectId)
      );

    return res.status(200).json({
      success: true,
      message:
        "Team member removed successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.log(
      "Remove Team Member Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const leaveProject = async (
  req,
  res
) => {
  try {
    const { projectId } = req.params;

    const project =
      await Project.findById(projectId);

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

    return res.status(200).json({
      success: true,
      message:
        "You left the project successfully",
    });
  } catch (error) {
    console.log(
      "Leave Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const recommendTeamMembers = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const project =
      await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const currentUserId =
      req.user._id.toString();

    const isOwner =
      project.createdBy.toString() ===
      currentUserId;

    const isMember =
      project.teamMembers.some(
        (member) =>
          member.toString() ===
          currentUserId
      );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message:
          "You must be a project team member to use AI recommendations",
      });
    }

    const currentTeamMemberIds =
      project.teamMembers.map(
        (member) =>
          member.toString()
      );

    const users = await User.find({
      _id: {
        $nin: currentTeamMemberIds,
      },
    })
      .select(
        "name email profileImage skills bio branch year"
      )
      .limit(100);

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "No additional users are available for recommendation",
        recommendations: [],
      });
    }

    const projectForAI = {
      title: project.title,
      description: project.description,
      requiredSkills:
        project.requiredSkills || [],
      projectType:
        project.projectType || "",
    };

    const membersForAI =
      users.map((user) => ({
        _id: user._id.toString(),
        name: user.name || "",
        skills: Array.isArray(
          user.skills
        )
          ? user.skills
          : [],
        bio: user.bio || "",
        branch: user.branch || "",
        year: user.year || "",
      }));

    const aiResult =
      await recommendTeamMembersWithAI({
        project: projectForAI,
        members: membersForAI,
      });

    const validUsers = new Map();

    users.forEach((user) => {
      validUsers.set(
        user._id.toString(),
        user
      );
    });

    const recommendations =
      Array.isArray(
        aiResult?.recommendations
      )
        ? aiResult.recommendations
        : [];

    const finalRecommendations =
      recommendations
        .filter(
          (recommendation) =>
            recommendation?.userId &&
            validUsers.has(
              recommendation.userId.toString()
            )
        )
        .map((recommendation) => {
          const user =
            validUsers.get(
              recommendation.userId.toString()
            );

          const matchPercentage =
            Number(
              recommendation.matchPercentage
            );

          return {
            userId: user._id,
            name: user.name,
            email: user.email,
            profileImage:
              user.profileImage || "",
            skills:
              Array.isArray(user.skills)
                ? user.skills
                : [],
            branch:
              user.branch || "",
            year:
              user.year || "",
            matchPercentage:
              Number.isFinite(
                matchPercentage
              )
                ? Math.max(
                    0,
                    Math.min(
                      100,
                      Math.round(
                        matchPercentage
                      )
                    )
                  )
                : 0,
            matchedSkills:
              Array.isArray(
                recommendation.matchedSkills
              )
                ? recommendation.matchedSkills
                : [],
            missingSkills:
              Array.isArray(
                recommendation.missingSkills
              )
                ? recommendation.missingSkills
                : [],
            reason:
              recommendation.reason ||
              "This user has skills that may be useful for the project.",
          };
        })
        .sort(
          (a, b) =>
            b.matchPercentage -
            a.matchPercentage
        );

    return res.status(200).json({
      success: true,
      project: {
        _id: project._id,
        title: project.title,
        requiredSkills:
          project.requiredSkills || [],
      },
      count:
        finalRecommendations.length,
      recommendations:
        finalRecommendations,
    });
  } catch (error) {
    console.log(
      "AI Team Recommendation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to generate AI team recommendations",
    });
  }
};