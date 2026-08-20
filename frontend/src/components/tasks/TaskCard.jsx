import { useState } from "react";
import {
  FaCalendarAlt,
  FaCommentDots,
  FaEdit,
  FaEllipsisV,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";

import TaskDetailsModal from "./TaskDetailsModal";
import EditTaskModal from "./EditTaskModal";

import api from "../../services/api";

function TaskCard({ task, fetchTasks }) {
  const [showMenu, setShowMenu] = useState(false);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showEdit, setShowEdit] =
    useState(false);

  // ============================
  // Delete Task
  // ============================

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${task._id}`);

      fetchTasks();
    } catch (error) {
      console.log(error);

      alert("Unable to delete task.");
    }
  };

  // ============================
  // Priority Badge
  // ============================

  const getPriorityColor = () => {
    switch (task.priority) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

      case "Medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

      case "Low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300";
    }
  };

  // ============================
  // Status Badge
  // ============================

  const getStatusColor = () => {
    switch (task.status) {
      case "Todo":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";

      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

      case "Review":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

      case "Done":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300";
    }
  };

  // ============================
  // Format Deadline
  // ============================

  const formatDate = (date) => {
    if (!date) return "No Deadline";

    return new Date(date).toLocaleDateString();
  };
    return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className="
          bg-white
          dark:bg-slate-900
          border
          border-gray-200
          dark:border-slate-700
          rounded-2xl
          p-4
          shadow-sm
          hover:shadow-lg
          transition-all
          duration-300
          cursor-pointer
          relative
          group
        "
      >
        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex-1">

            <h3
              className="
                text-lg
                font-semibold
                text-gray-900
                dark:text-white
                line-clamp-2
              "
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className="
                  mt-2
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                  line-clamp-3
                "
              >
                {task.description}
              </p>
            )}

          </div>

          {/* Menu */}

          <div className="relative ml-3">

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="
                p-2
                rounded-lg
                hover:bg-gray-100
                dark:hover:bg-slate-700
              "
            >
              <FaEllipsisV className="text-gray-500" />
            </button>

            {showMenu && (
              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-40
                  bg-white
                  dark:bg-slate-800
                  border
                  border-gray-200
                  dark:border-slate-700
                  rounded-xl
                  shadow-xl
                  z-50
                "
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEdit(true);
                    setShowMenu(false);
                  }}
                  className="
                    w-full
                    px-4
                    py-3
                    flex
                    items-center
                    gap-2
                    hover:bg-gray-100
                    dark:hover:bg-slate-700
                  "
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="
                    w-full
                    px-4
                    py-3
                    flex
                    items-center
                    gap-2
                    text-red-600
                    hover:bg-red-50
                    dark:hover:bg-red-900/20
                  "
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Priority + Status */}

        <div className="flex flex-wrap gap-2 mt-4">

          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
              ${getPriorityColor()}
            `}
          >
            {task.priority}
          </span>

          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
              ${getStatusColor()}
            `}
          >
            {task.status}
          </span>

        </div>

        {/* Skills */}

        {task.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">

            {task.requiredSkills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="
                  px-2
                  py-1
                  rounded-md
                  bg-violet-100
                  dark:bg-violet-900/30
                  text-violet-700
                  dark:text-violet-300
                  text-xs
                "
              >
                {skill}
              </span>
            ))}

          </div>
        )}

        {/* Footer */}

        <div
          className="
            mt-5
            pt-4
            border-t
            border-gray-200
            dark:border-slate-700
            flex
            items-center
            justify-between
          "
        >

          <div className="flex items-center gap-2">

            <FaUserCircle
              className="
                text-2xl
                text-violet-500
              "
            />

            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Assigned To
              </p>

              <p
                className="
                  text-sm
                  font-medium
                  text-gray-800
                  dark:text-white
                "
              >
                {task.assignedTo?.name || "Unassigned"}
              </p>

            </div>

          </div>
                    <div className="flex flex-col items-end gap-2">

            {/* Deadline */}

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
              <FaCalendarAlt className="text-sm" />

              <span className="text-xs">
                {formatDate(task.deadline)}
              </span>
            </div>

            {/* Estimated Hours */}

            {task.estimatedHours && (
              <span
                className="
                  text-xs
                  px-2
                  py-1
                  rounded-md
                  bg-slate-100
                  dark:bg-slate-700
                  text-gray-700
                  dark:text-gray-200
                "
              >
                ⏱ {task.estimatedHours} hrs
              </span>
            )}

          </div>

        </div>

        {/* Bottom Section */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
          "
        >

          {/* Labels */}

          <div className="flex flex-wrap gap-2">

            {task.labels?.slice(0, 3).map((label, index) => (
              <span
                key={index}
                className="
                  px-2
                  py-1
                  rounded-full
                  text-[11px]
                  bg-indigo-100
                  text-indigo-700
                  dark:bg-indigo-900/30
                  dark:text-indigo-300
                "
              >
                #{label}
              </span>
            ))}

          </div>

          {/* Comments */}

          <div
            className="
              flex
              items-center
              gap-2
              text-gray-500
              dark:text-gray-300
            "
          >
            <FaCommentDots />

            <span className="text-sm">
              {task.comments?.length || 0}
            </span>

          </div>

        </div>

      </div>

      {/* ============================
          Task Details Modal
      ============================ */}

      {showDetails && (
        <TaskDetailsModal
          task={task}
          onClose={() => setShowDetails(false)}
          fetchTasks={fetchTasks}
        />
      )}

      {/* ============================
          Edit Task Modal
      ============================ */}

      {showEdit && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEdit(false)}
          onTaskUpdated={() => {
            fetchTasks();
            setShowEdit(false);
          }}
        />
      )}
    </>
  );
}

export default TaskCard;