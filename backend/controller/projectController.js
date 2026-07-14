import Project from "../model/Project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      requiredSkills,
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
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

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
      createdBy: req.user._id,
    })
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

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


export const getSingleProject = async (
  req,
  res
) => {
  try {
    const project = await Project.findById(
      req.params.id
    )
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

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