import { useState } from "react";
import {
  FaGithub,
  FaTimes,
  FaPlus,
  FaRobot,
  FaLightbulb,
  FaCode,
  FaUsers,
  FaRoute,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "../../services/api";

function CreateProjectModal({
  onClose,
  onProjectCreated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    requiredSkills: "",
    githubLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiError, setAiError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (
      e.target.name === "title" ||
      e.target.name === "description" ||
      e.target.name === "requiredSkills"
    ) {
      setAiAnalysis(null);
      setAiError("");
    }
  };

  const getRequiredSkills = () => {
    return formData.requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  const handleAIAnalysis = async () => {
    if (!formData.title.trim()) {
      setAiError("Please enter a project title first.");
      return;
    }

    if (!formData.description.trim()) {
      setAiError(
        "Please enter a project description first."
      );
      return;
    }

    try {
      setAiLoading(true);
      setAiError("");
      setAiAnalysis(null);

      const res = await api.post(
        "/ai/analyze-project",
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          requiredSkills: getRequiredSkills(),
          projectType: "Web Application",
        }
      );

      if (!res.data?.success || !res.data?.analysis) {
        throw new Error(
          res.data?.message ||
            "AI analysis failed"
        );
      }

      setAiAnalysis(res.data.analysis);
    } catch (error) {
      console.log("AI Analysis Error:", error);

      setAiError(
        error.response?.data?.message ||
          error.message ||
          "Unable to analyze project with AI."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const addSuggestedSkills = () => {
    if (
      !aiAnalysis?.recommendedSkills ||
      !Array.isArray(
        aiAnalysis.recommendedSkills
      )
    ) {
      return;
    }

    const currentSkills =
      getRequiredSkills();

    const existingSkills = new Set(
      currentSkills.map((skill) =>
        skill.toLowerCase()
      )
    );

    const newSkills =
      aiAnalysis.recommendedSkills.filter(
        (skill) =>
          typeof skill === "string" &&
          skill.trim() &&
          !existingSkills.has(
            skill.trim().toLowerCase()
          )
      );

    setFormData((prev) => ({
      ...prev,
      requiredSkills: [
        ...currentSkills,
        ...newSkills,
      ].join(", "),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Project title is required");
      return;
    }

    if (!formData.description.trim()) {
      alert("Project description is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/create", {
        title: formData.title.trim(),
        description:
          formData.description.trim(),
        image: formData.image.trim(),
        requiredSkills:
          getRequiredSkills(),
        githubLink:
          formData.githubLink.trim(),
      });

      setFormData({
        title: "",
        description: "",
        image: "",
        requiredSkills: "",
        githubLink: "",
      });

      setAiAnalysis(null);
      setAiError("");

      if (onProjectCreated) {
        await onProjectCreated();
      }

      onClose();
    } catch (error) {
      console.log(
        "Create Project Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-xl p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <FaPlus className="text-violet-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Create New Project
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Build your project and let AI help you plan it.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Project Title *
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>

            <textarea
              name="description"
              placeholder="Describe your project..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Project Image URL
            </label>

            <input
              type="url"
              name="image"
              placeholder="https://example.com/project-image.jpg"
              value={formData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {formData.image && (
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Image Preview
              </label>

              <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <img
                  src={formData.image}
                  alt="Project Preview"
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Required Skills
              </label>

              <button
                type="button"
                onClick={handleAIAnalysis}
                disabled={
                  aiLoading ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaRobot />

                {aiLoading
                  ? "Analyzing..."
                  : "Analyze with AI"}
              </button>
            </div>

            <input
              type="text"
              name="requiredSkills"
              placeholder="React, Node.js, MongoDB"
              value={formData.requiredSkills}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Separate skills using commas. AI can suggest additional skills.
            </p>
          </div>

          {aiError && (
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <div className="flex gap-3">
                <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />

                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">
                    AI Analysis Failed
                  </p>

                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {aiError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {aiAnalysis && (
            <div className="border border-violet-200 dark:border-violet-800 rounded-2xl overflow-hidden bg-violet-50/50 dark:bg-violet-900/10">
              <div className="p-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                    <FaRobot className="text-xl" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      AI Project Analysis
                    </h3>

                    <p className="text-sm text-violet-100 mt-1">
                      AI-powered recommendations for your project
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {aiAnalysis.summary && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FaLightbulb className="text-violet-600" />
                      Project Summary
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {aiAnalysis.summary}
                    </p>
                  </div>
                )}

                {aiAnalysis.difficulty && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Project Difficulty
                    </span>

                    <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold">
                      {aiAnalysis.difficulty}
                    </span>
                  </div>
                )}

                {Array.isArray(
                  aiAnalysis.recommendedTechStack
                ) &&
                  aiAnalysis.recommendedTechStack
                    .length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCode className="text-violet-600" />
                        Recommended Tech Stack
                      </h4>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {aiAnalysis.recommendedTechStack.map(
                          (item, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-800 text-sm text-violet-700 dark:text-violet-300 font-medium"
                            >
                              {item}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {Array.isArray(
                  aiAnalysis.recommendedSkills
                ) &&
                  aiAnalysis.recommendedSkills
                    .length > 0 && (
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FaLightbulb className="text-violet-600" />
                          Recommended Skills
                        </h4>

                        <button
                          type="button"
                          onClick={addSuggestedSkills}
                          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300"
                        >
                          Add Suggested Skills
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {aiAnalysis.recommendedSkills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {Array.isArray(
                  aiAnalysis.requiredRoles
                ) &&
                  aiAnalysis.requiredRoles
                    .length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaUsers className="text-violet-600" />
                        Required Team Roles
                      </h4>

                      <div className="mt-3 space-y-2">
                        {aiAnalysis.requiredRoles.map(
                          (role, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                            >
                              <span className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>

                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {role}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {Array.isArray(
                  aiAnalysis.missingSkills
                ) &&
                  aiAnalysis.missingSkills
                    .length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Missing Skills
                      </h4>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {aiAnalysis.missingSkills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {Array.isArray(
                  aiAnalysis.roadmap
                ) &&
                  aiAnalysis.roadmap.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaRoute className="text-violet-600" />
                        Development Roadmap
                      </h4>

                      <div className="mt-3 space-y-3">
                        {aiAnalysis.roadmap.map(
                          (step, index) => (
                            <div
                              key={index}
                              className="flex gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>

                              <div className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {step}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {Array.isArray(
                  aiAnalysis.suggestions
                ) &&
                  aiAnalysis.suggestions
                    .length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaLightbulb className="text-violet-600" />
                        AI Suggestions
                      </h4>

                      <div className="mt-3 space-y-2">
                        {aiAnalysis.suggestions.map(
                          (suggestion, index) => (
                            <p
                              key={index}
                              className="text-sm text-gray-600 dark:text-gray-300 leading-6"
                            >
                              • {suggestion}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-300">
              <FaGithub className="text-lg" />
              GitHub Repository
            </label>

            <input
              type="url"
              name="githubLink"
              placeholder="https://github.com/username/project"
              value={formData.githubLink}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Add the GitHub repository link for your project.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating..."
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;