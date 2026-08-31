import { analyzeProjectWithAI } from "./aiService.js";

export const analyzeProject = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      projectType,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project description is required",
      });
    }

    const skills = Array.isArray(requiredSkills)
      ? requiredSkills.filter(
          (skill) =>
            typeof skill === "string" &&
            skill.trim()
        )
      : [];

    const analysis = await analyzeProjectWithAI({
      title: title.trim(),
      description: description.trim(),
      requiredSkills: skills,
      projectType: projectType?.trim() || "",
    });

    return res.status(200).json({
      success: true,
      message: "Project analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error(
      "AI Project Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to analyze project with AI",
    });
  }
};