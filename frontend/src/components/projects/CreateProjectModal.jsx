import { useState } from "react";
import { FaGithub, FaTimes, FaPlus } from "react-icons/fa";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/create", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        githubLink: formData.githubLink.trim(),
      });

      setFormData({
        title: "",
        description: "",
        image: "",
        requiredSkills: "",
        githubLink: "",
      });

      if (onProjectCreated) {
        await onProjectCreated();
      }

      onClose();
    } catch (error) {
      console.log("Create Project Error:", error);

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
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <FaPlus className="text-violet-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Create New Project
            </h2>
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

        <form onSubmit={handleSubmit} className="space-y-5">

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
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Required Skills
            </label>

            <input
              type="text"
              name="requiredSkills"
              placeholder="React, Node.js, MongoDB"
              value={formData.requiredSkills}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Separate skills using commas.
            </p>
          </div>

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
              {loading ? "Creating..." : "Create Project"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;