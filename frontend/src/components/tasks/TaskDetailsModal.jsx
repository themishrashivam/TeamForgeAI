import { useState, useEffect } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaUserCircle,
  FaCommentDots,
  FaCode,
  FaTag,
  FaClock,
  FaPaperclip,
} from "react-icons/fa";
import api from "../../services/api";

function TaskDetailsModal({
  task,
  onClose,
  fetchTasks,
}) {
  const [taskData, setTaskData] = useState(task);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTaskData(task);
  }, [task]);

  // ==========================
  // Format Date
  // ==========================

  const formatDate = (date) => {
    if (!date) return "No Deadline";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================
  // Add Comment
  // ==========================

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);

      const { data } = await api.post(
        `/tasks/${task._id}/comment`,
        {
          text: newComment,
        }
      );

      setTaskData(data.task);
      setNewComment("");

      if (fetchTasks) {
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Delete Comment
  // ==========================

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(
        `/tasks/${task._id}/comment/${commentId}`
      );

      setTaskData((prev) => ({
        ...prev,
        comments: prev.comments.filter(
          (item) => item._id !== commentId
        ),
      }));

      if (fetchTasks) {
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col">

        {/* Header */}

        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-slate-700">

          <div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Task Details
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View complete information about this task.
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            <FaTimes className="text-xl text-gray-600 dark:text-gray-300" />
          </button>

        </div>

        {/* Scrollable Body */}

        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                  {/* ==========================
              Task Information
          ========================== */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Section */}

            <div className="lg:col-span-2 space-y-8">

              {/* Title */}

              <div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {taskData.title}
                </h1>

                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7">
                  {taskData.description || "No description available."}
                </p>

              </div>

              {/* Required Skills */}

              <div>

                <div className="flex items-center gap-2 mb-4">
                  <FaCode className="text-violet-600" />

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Required Skills
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">

                  {taskData.requiredSkills?.length ? (

                    taskData.requiredSkills.map((skill, index) => (

                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm"
                      >
                        {skill}
                      </span>

                    ))

                  ) : (

                    <p className="text-gray-500 dark:text-gray-400">
                      No required skills added.
                    </p>

                  )}

                </div>

              </div>

              {/* Labels */}

              <div>

                <div className="flex items-center gap-2 mb-4">
                  <FaTag className="text-indigo-600" />

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Labels
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">

                  {taskData.labels?.length ? (

                    taskData.labels.map((label, index) => (

                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm"
                      >
                        #{label}
                      </span>

                    ))

                  ) : (

                    <p className="text-gray-500 dark:text-gray-400">
                      No labels available.
                    </p>

                  )}

                </div>

              </div>

              {/* Attachments */}

              <div>

                <div className="flex items-center gap-2 mb-4">
                  <FaPaperclip className="text-gray-600" />

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Attachments
                  </h3>
                </div>

                {taskData.attachments?.length ? (

                  <div className="space-y-3">

                    {taskData.attachments.map((file, index) => (

                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                      >
                        Attachment {index + 1}
                      </a>

                    ))}

                  </div>

                ) : (

                  <p className="text-gray-500 dark:text-gray-400">
                    No attachments uploaded.
                  </p>

                )}

              </div>

            </div>

            {/* Right Section */}

            <div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 space-y-6">

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Task Summary
                </h3>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Priority</span>

                  <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                    {taskData.priority}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>

                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                    {taskData.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">

                  <FaUserCircle className="text-5xl text-violet-500" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Assigned To
                    </p>

                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {taskData.assignedTo?.name || "Unassigned"}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {taskData.assignedTo?.email || ""}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <FaCalendarAlt className="text-orange-500" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Deadline
                    </p>

                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {formatDate(taskData.deadline)}
                    </h4>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <FaClock className="text-green-500" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Estimated Hours
                    </p>

                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {taskData.estimatedHours || 0} Hours
                    </h4>

                  </div>

                </div>

              </div>

            </div>

          </div>
                    {/* ==========================
              Comments Section
          ========================== */}

          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6">

            <div className="flex items-center gap-2 mb-6">
              <FaCommentDots className="text-violet-600" />

              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Comments
              </h3>
            </div>

            {/* Add Comment */}

            <div className="flex gap-3 mb-6">

              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              <button
                onClick={handleAddComment}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add"}
              </button>

            </div>

            {/* Comments List */}

            <div className="space-y-4">

              {taskData.comments?.length ? (

                taskData.comments.map((comment) => (

                  <div
                    key={comment._id}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 flex justify-between gap-4"
                  >

                    <div>

                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {comment.user?.name || "User"}
                      </h4>

                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {comment.text}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : ""}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        handleDeleteComment(comment._id)
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>

                  </div>

                ))

              ) : (

                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No comments yet.
                </div>

              )}

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t border-gray-200 dark:border-slate-700 px-8 py-5 flex justify-end">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-medium"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default TaskDetailsModal;