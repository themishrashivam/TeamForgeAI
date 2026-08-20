import { useState } from "react";
import api from "../../services/api";

function EditProjectModal({
  project,
  onClose,
  onProjectUpdated,
}) {
  const [formData, setFormData] = useState({
    title: project.title || "",
    description: project.description || "",
    image: project.image || "",
    category: project.category || "",
    projectType: project.projectType || "",
    visibility: project.visibility || "Public",
    requiredSkills:
      project.requiredSkills?.join(", ") || "",
    status: project.status || "Active",
    githubLink: project.githubLink || "",
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

      await api.put(`/${project._id}`, {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        category: formData.category,
        projectType: formData.projectType,
        visibility: formData.visibility,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        status: formData.status,
        githubLink: formData.githubLink,
      });

      onProjectUpdated();
      onClose();
    } catch (error) {
      console.log(
        "Update Project Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Project
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Project Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Project Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Required Skills
            </label>

            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Project Type
              </label>

              <input
                type="text"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="On Hold">
                  On Hold
                </option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Visibility
              </label>

              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl"
              >
                <option value="Public">
                  Public
                </option>

                <option value="Private">
                  Private
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              GitHub Repository
            </label>

            <input
              type="url"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/username/repository"
              className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 dark:border-slate-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
            >
              {loading
                ? "Updating..."
                : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;