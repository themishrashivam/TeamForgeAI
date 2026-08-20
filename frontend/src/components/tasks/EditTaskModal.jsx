import { useState, useEffect } from "react";
import {
  FaTimes,
  FaSave,
  FaTasks,
} from "react-icons/fa";
import api from "../../services/api";

function EditTaskModal({
  task,
  onClose,
  fetchTasks,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    deadline: "",
    estimatedHours: "",
    requiredSkills: "",
    labels: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!task) return;

    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "Todo",
      priority: task.priority || "Medium",
      deadline: task.deadline
        ? task.deadline.substring(0, 10)
        : "",
      estimatedHours: task.estimatedHours || "",
      requiredSkills: task.requiredSkills
        ? task.requiredSkills.join(", ")
        : "",
      labels: task.labels
        ? task.labels.join(", ")
        : "",
    });
  }, [task]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await api.put(`/tasks/${task._id}`, {
        ...formData,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        labels: formData.labels
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      if (fetchTasks) {
        fetchTasks();
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-700">

          <div className="flex items-center gap-3">

            <FaTasks className="text-2xl text-violet-600" />

            <div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Task
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update task information
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            <FaTimes className="text-xl text-gray-600 dark:text-gray-300" />
          </button>

        </div>

        {/* Form */}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Title */}

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Task Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter task description"
            />
          </div>

          {/* Status & Priority */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

          </div>

          {/* Deadline & Estimated Hours */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Estimated Hours
              </label>

              <input
                type="number"
                min="0"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white"
                placeholder="0"
              />
            </div>

          </div>

          {/* Required Skills */}

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Required Skills
            </label>

            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white"
            />

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Separate each skill with a comma.
            </p>
          </div>

          {/* Labels */}

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Labels
            </label>

            <input
              type="text"
              name="labels"
              value={formData.labels}
              onChange={handleChange}
              placeholder="Frontend, Bug, API"
              className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white"
            />

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Separate labels with commas.
            </p>
          </div>
                  </div>

        {/* Footer */}

        <div className="border-t border-gray-200 dark:border-slate-700 px-6 py-5 flex items-center justify-end gap-4">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />

            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditTaskModal;
