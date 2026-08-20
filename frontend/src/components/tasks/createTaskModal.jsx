import { useState } from "react";
import {
  FaTimes,
  FaPlus,
  FaTasks,
} from "react-icons/fa";

import api from "../../services/api";

function CreateTaskModal({
  projectId,
  onClose,
  onTaskCreated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    estimatedHours: "",
    requiredSkills: "",
    labels: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Handle Input Change
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Create Task
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectId) {
      alert("Project ID is missing.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Task title is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        projectId,

        priority: formData.priority,

        deadline: formData.deadline
          ? formData.deadline
          : null,

        estimatedHours:
          formData.estimatedHours === ""
            ? 0
            : Number(formData.estimatedHours),

        requiredSkills: formData.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        labels: formData.labels
          .split(",")
          .map((label) => label.trim())
          .filter(Boolean),
      };

      const response = await api.post(
        "/tasks/create",
        payload
      );

      if (response.data?.success) {
        alert("Task created successfully.");

        setFormData({
          title: "",
          description: "",
          priority: "Medium",
          deadline: "",
          estimatedHours: "",
          requiredSkills: "",
          labels: "",
        });

        if (onTaskCreated) {
          onTaskCreated(response.data.task);
        }

        if (onClose) {
          onClose();
        }
      } else {
        alert(
          response.data?.message ||
            "Failed to create task."
        );
      }
    } catch (error) {
      console.error(
        "Create Task Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/60
        flex
        items-center
        justify-center
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-3xl
          max-h-[90vh]
          overflow-hidden
          rounded-3xl
          bg-white
          dark:bg-slate-900
          shadow-2xl
          flex
          flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* =====================================
            Header
        ====================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-gray-200
            dark:border-slate-700
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-violet-100
                dark:bg-violet-900/30
                flex
                items-center
                justify-center
              "
            >
              <FaTasks className="text-violet-600 text-lg" />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                Create Task
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Add a new task to your project
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              p-2
              rounded-lg
              hover:bg-gray-100
              dark:hover:bg-slate-800
              transition
              disabled:opacity-50
            "
          >
            <FaTimes
              className="
                text-xl
                text-gray-600
                dark:text-gray-300
              "
            />
          </button>
        </div>

        {/* =====================================
            Form Body
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            flex-1
            overflow-y-auto
            p-6
            space-y-6
          "
        >

          {/* Task Title */}

          <div>
            <label
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-300
              "
            >
              Task Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-slate-700
                bg-white
                dark:bg-slate-800
                px-4
                py-3
                text-gray-900
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>

          {/* Description */}

          <div>
            <label
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-300
              "
            >
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe what needs to be done..."
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-slate-700
                bg-white
                dark:bg-slate-800
                px-4
                py-3
                text-gray-900
                dark:text-white
                outline-none
                resize-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>

          {/* Status & Priority */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            {/* Status */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Initial Status
              </label>

              <input
                type="text"
                value="Todo"
                disabled
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  dark:border-slate-700
                  bg-gray-100
                  dark:bg-slate-800
                  px-4
                  py-3
                  text-gray-500
                  dark:text-gray-400
                  cursor-not-allowed
                "
              />

              <p
                className="
                  mt-2
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                New tasks start in Todo status.
              </p>
            </div>

            {/* Priority */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  px-4
                  py-3
                  text-gray-900
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-violet-500
                "
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>

          </div>

          {/* Deadline & Estimated Hours */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            {/* Deadline */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  px-4
                  py-3
                  text-gray-900
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-violet-500
                "
              />
            </div>

            {/* Estimated Hours */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Estimated Hours
              </label>

              <input
                type="number"
                name="estimatedHours"
                min="0"
                value={formData.estimatedHours}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  px-4
                  py-3
                  text-gray-900
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-violet-500
                "
              />
            </div>

          </div>

          {/* Required Skills */}

          <div>
            <label
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-300
              "
            >
              Required Skills
            </label>

            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-slate-700
                bg-white
                dark:bg-slate-800
                px-4
                py-3
                text-gray-900
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Separate skills with commas.
            </p>
          </div>

          {/* Labels */}

          <div>
            <label
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-300
              "
            >
              Labels
            </label>

            <input
              type="text"
              name="labels"
              value={formData.labels}
              onChange={handleChange}
              placeholder="Frontend, Bug, API"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-slate-700
                bg-white
                dark:bg-slate-800
                px-4
                py-3
                text-gray-900
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Separate labels with commas.
            </p>
          </div>

          {/* =====================================
              Footer
          ====================================== */}

          <div
            className="
              border-t
              border-gray-200
              dark:border-slate-700
              pt-6
              flex
              flex-col-reverse
              sm:flex-row
              sm:justify-end
              gap-3
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                px-6
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-slate-600
                text-gray-700
                dark:text-gray-300
                hover:bg-gray-100
                dark:hover:bg-slate-800
                transition
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
                rounded-xl
                bg-violet-600
                hover:bg-violet-700
                text-white
                font-semibold
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <FaPlus />

              {loading
                ? "Creating..."
                : "Create Task"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;