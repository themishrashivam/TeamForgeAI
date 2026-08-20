import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaGithub,
  FaUsers,
  FaTasks,
  FaCode,
  FaUserCircle,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import api from "../services/api";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    projectType: "",
    visibility: "",
    requiredSkills: "",
    status: "",
    githubLink: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data.user);
    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/${id}`);

      setProject(res.data.project);
    } catch (error) {
      console.log("Project Fetch Error:", error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProject();
  }, [id]);

  const handleTaskBoard = () => {
    navigate(`/project/${id}/tasks`);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const openEditModal = () => {
    setEditData({
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

    setShowEditModal(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      const res = await api.put(`/${id}`, {
        title: editData.title,
        description: editData.description,
        image: editData.image,
        category: editData.category,
        projectType: editData.projectType,
        visibility: editData.visibility,
        requiredSkills: editData.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        status: editData.status,
        githubLink: editData.githubLink,
      });

      setProject(res.data.project);

      setShowEditModal(false);

      alert("Project updated successfully.");
    } catch (error) {
      console.log("Update Project Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update project."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoading(true);

      await api.delete(`/${id}`);

      alert("Project deleted successfully.");

      navigate("/projects");
    } catch (error) {
      console.log("Delete Project Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete project."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (!confirmRemove) {
      return;
    }

    try {
      setActionLoading(true);

      await api.delete(
        `/${id}/members/${userId}`
      );

      await fetchProject();
    } catch (error) {
      console.log(
        "Remove Member Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to remove member."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveProject = async () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this project?"
    );

    if (!confirmLeave) {
      return;
    }

    try {
      setActionLoading(true);

      await api.delete(`/${id}/leave`);

      alert(
        "You left the project successfully."
      );

      navigate("/projects");
    } catch (error) {
      console.log(
        "Leave Project Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to leave project."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const isProjectOwner =
    user?._id &&
    project?.createdBy?._id &&
    user._id.toString() ===
      project.createdBy._id.toString();

  const isCurrentUserMember =
    user?._id &&
    project?.teamMembers?.some((member) => {
      const memberId =
        typeof member === "object"
          ? member._id
          : member;

      return (
        memberId?.toString() ===
        user._id.toString()
      );
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
        <Sidebar />

        <div className="flex-1 md:ml-64">
          <Topbar user={user} />

          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-gray-500 dark:text-gray-300">
                Loading Project...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
        <Sidebar />

        <div className="flex-1 md:ml-64">
          <Topbar user={user} />

          <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Project Not Found
              </h2>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                The project you're looking for does not exist or could not be loaded.
              </p>

              <button
                onClick={() =>
                  navigate("/projects")
                }
                className="mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-900 flex">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Topbar user={user} />

        <main className="p-4 sm:p-6 md:p-8">
          <button
            onClick={() =>
              navigate("/projects")
            }
            className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-300 hover:text-violet-600 transition"
          >
            <FaArrowLeft />
            <span>Back to Projects</span>
          </button>

          <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="relative">
              <img
                src={
                  project.image ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                }
                alt={project.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.status && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white">
                      {project.status}
                    </span>
                  )}

                  {project.category && (
                    <span className="px-3 py-1 rounded-full text-sm bg-white/20 backdrop-blur text-white">
                      {project.category}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  {project.title}
                </h1>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
                <button
                  onClick={handleTaskBoard}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition"
                >
                  <FaTasks />
                  Open Task Board
                </button>

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                  >
                    <FaGithub />
                    GitHub Repository
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                )}

                {isProjectOwner && (
                  <>
                    <button
                      onClick={openEditModal}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                    >
                      <FaEdit />
                      Edit Project
                    </button>

                    <button
                      onClick={handleDeleteProject}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
                    >
                      <FaTrash />
                      {actionLoading
                        ? "Deleting..."
                        : "Delete Project"}
                    </button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="p-5 rounded-2xl bg-violet-50 dark:bg-violet-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                      <FaUsers className="text-violet-600" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Team Members
                      </p>

                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {project.teamMembers?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <FaCode className="text-blue-600" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Required Skills
                      </p>

                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {project.requiredSkills?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                      <FaTasks className="text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Task Management
                      </p>

                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      About This Project
                    </h2>

                    <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-line">
                      {project.description ||
                        "No project description available."}
                    </p>
                  </section>

                  <section className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Required Skills
                    </h2>

                    {project.requiredSkills?.length > 0 ? (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {project.requiredSkills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mt-4 text-gray-500 dark:text-gray-400">
                        No specific skills listed.
                      </p>
                    )}
                  </section>

                  <section className="mt-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Team Members
                      </h2>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.teamMembers?.length || 0} members
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {project.teamMembers?.length > 0 ? (
                        project.teamMembers.map(
                          (member, index) => {
                            const memberData =
                              typeof member === "object"
                                ? member
                                : null;

                            const memberId =
                              memberData?._id || member;

                            const memberIsOwner =
                              project.createdBy?._id
                                ?.toString() ===
                              memberId?.toString();

                            const memberIsCurrentUser =
                              user?._id?.toString() ===
                              memberId?.toString();

                            return (
                              <div
                                key={
                                  memberId || index
                                }
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900"
                              >
                                <div className="flex items-center gap-3">
                                  {memberData?.profileImage ? (
                                    <img
                                      src={
                                        memberData.profileImage
                                      }
                                      alt={
                                        memberData.name
                                      }
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <FaUserCircle className="text-4xl text-violet-500" />
                                  )}

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="font-semibold text-gray-900 dark:text-white">
                                        {memberData?.name ||
                                          "Team Member"}
                                      </p>

                                      {memberIsOwner && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                                          Owner
                                        </span>
                                      )}

                                      {memberIsCurrentUser &&
                                        !memberIsOwner && (
                                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                            You
                                          </span>
                                        )}
                                    </div>

                                    {memberData?.email && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {memberData.email}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {isProjectOwner &&
                                  !memberIsOwner && (
                                    <button
                                      onClick={() =>
                                        handleRemoveMember(
                                          memberId
                                        )
                                      }
                                      disabled={actionLoading}
                                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition disabled:opacity-50"
                                    >
                                      <FaTrash />

                                      {actionLoading
                                        ? "Removing..."
                                        : "Remove"}
                                    </button>
                                  )}
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-900 text-center">
                          <FaUsers className="mx-auto text-3xl text-gray-400" />

                          <p className="mt-3 text-gray-500 dark:text-gray-400">
                            No team members yet.
                          </p>
                        </div>
                      )}
                    </div>

                    {isCurrentUserMember &&
                      !isProjectOwner && (
                        <button
                          onClick={handleLeaveProject}
                          disabled={actionLoading}
                          className="mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                        >
                          <FaSignOutAlt />

                          {actionLoading
                            ? "Leaving..."
                            : "Leave Project"}
                        </button>
                      )}
                  </section>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Project Owner
                    </h3>

                    <div className="flex items-center gap-3 mt-5">
                      {project.createdBy?.profileImage ? (
                        <img
                          src={
                            project.createdBy.profileImage
                          }
                          alt={
                            project.createdBy.name
                          }
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-4xl text-violet-500" />
                      )}

                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {project.createdBy?.name ||
                            "Unknown"}
                        </p>

                        {project.createdBy?.email && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {project.createdBy.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Project Information
                    </h3>

                    <div className="mt-5 space-y-4">
                      {project.projectType && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-500 dark:text-gray-400">
                            Type
                          </span>

                          <span className="font-medium text-gray-900 dark:text-white">
                            {project.projectType}
                          </span>
                        </div>
                      )}

                      {project.category && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-500 dark:text-gray-400">
                            Category
                          </span>

                          <span className="font-medium text-gray-900 dark:text-white">
                            {project.category}
                          </span>
                        </div>
                      )}

                      {project.visibility && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-500 dark:text-gray-400">
                            Visibility
                          </span>

                          <span className="font-medium text-gray-900 dark:text-white">
                            {project.visibility}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-500 dark:text-gray-400">
                          Status
                        </span>

                        <span className="font-medium text-green-600">
                          {project.status ||
                            "Active"}
                        </span>
                      </div>

                      {project.createdAt && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <FaCalendarAlt />
                            Created
                          </span>

                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(
                              project.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                    <FaTasks className="text-3xl" />

                    <h3 className="text-xl font-bold mt-4">
                      Manage Project Tasks
                    </h3>

                    <p className="text-white/80 mt-2 text-sm">
                      Organize, track and manage all project tasks from the Kanban task board.
                    </p>

                    <button
                      onClick={handleTaskBoard}
                      className="mt-5 w-full py-3 rounded-xl bg-white text-violet-700 font-semibold hover:bg-gray-100 transition"
                    >
                      Open Task Board
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Project
              </h2>

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdateProject}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Project Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  required
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={editData.description}
                  onChange={handleEditChange}
                  required
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={editData.image}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Required Skills
                </label>

                <input
                  type="text"
                  name="requiredSkills"
                  value={editData.requiredSkills}
                  onChange={handleEditChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
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
                    value={editData.category}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Project Type
                  </label>

                  <input
                    type="text"
                    name="projectType"
                    value={editData.projectType}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Visibility
                  </label>

                  <select
                    name="visibility"
                    value={editData.visibility}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="Public">
                      Public
                    </option>

                    <option value="Private">
                      Private
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Status
                  </label>

                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Paused">
                      Paused
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
                  value={editData.githubLink}
                  onChange={handleEditChange}
                  placeholder="https://github.com/username/repository"
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                  className="px-5 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold disabled:opacity-50"
                >
                  {actionLoading
                    ? "Updating..."
                    : "Update Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;