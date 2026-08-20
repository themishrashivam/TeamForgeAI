import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";
import CreateProjectModal from "../components/projects/CreateProjectModal";

function MyProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    requiredSkills: "",
  });

  // ==========================================
  // Fetch Profile + Projects
  // ==========================================

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");

      setUser(res.data.user);
    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/my");

      setProjects(res.data.projects || []);
    } catch (error) {
      console.log("Projects Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Form Change
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Create Project
  // ==========================================

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await api.post("/create", {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });

      setShowCreateModal(false);

      setFormData({
        title: "",
        description: "",
        image: "",
        requiredSkills: "",
      });

      fetchProjects();
    } catch (error) {
      console.log("Create Project Error:", error);

      alert("Failed to create project");
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div
        className="
          h-screen
          flex
          items-center
          justify-center
          bg-[#f8f9fc]
          dark:bg-slate-900
          text-gray-900
          dark:text-white
        "
      >
        Loading...
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f8f9fc]
        dark:bg-slate-900
        text-gray-900
        dark:text-white
        flex
      "
    >
      <Sidebar />

      <div className="flex-1 md:ml-64">

        <Topbar user={user} />

        <div className="p-3 sm:p-4 md:p-6">

          {/* =====================================
              Header
          ====================================== */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:justify-between
              sm:items-center
              gap-4
              mb-8
            "
          >
            <div>

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                My Projects
              </h1>

              <p
                className="
                  text-gray-500
                  dark:text-gray-300
                  mt-2
                "
              >
                Manage and track your projects
              </p>

            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="
                w-full
                sm:w-auto
                px-5
                py-3
                bg-violet-600
                text-white
                rounded-xl
                hover:bg-violet-700
                transition
                font-semibold
              "
            >
              + Create Project
            </button>

          </div>

          {/* =====================================
              Projects
          ====================================== */}

          {projects.length > 0 ? (

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >

              {projects.map((project) => (

                <div
                  key={project._id}
                  onClick={() =>
                    navigate(`/project/${project._id}`)
                  }
                  className="
                    bg-white
                    dark:bg-slate-800
                    rounded-2xl
                    overflow-hidden
                    border
                    border-gray-200
                    dark:border-slate-700
                    cursor-pointer
                    hover:shadow-lg
                    transition
                  "
                >

                  {/* =================================
                      Project Image
                  ================================== */}

                  <img
                    src={
                      project.image ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                    }
                    alt={project.title}
                    className="
                      w-full
                      h-52
                      object-cover
                    "
                  />

                  {/* =================================
                      Project Content
                  ================================== */}

                  <div className="p-5">

                    {/* Title + Status */}

                    <div
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:justify-between
                        sm:items-center
                        gap-3
                      "
                    >

                      <h2
                        className="
                          text-xl
                          font-bold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        {project.title}
                      </h2>

                      <span
                        className="
                          px-3
                          py-1
                          bg-green-100
                          dark:bg-green-900/30
                          text-green-700
                          dark:text-green-300
                          rounded-full
                          text-sm
                          w-fit
                        "
                      >
                        {project.status || "Active"}
                      </span>

                    </div>

                    {/* Description */}

                    <p
                      className="
                        text-gray-600
                        dark:text-gray-300
                        mt-3
                        line-clamp-3
                      "
                    >
                      {project.description}
                    </p>

                    {/* Skills */}

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                        mt-4
                      "
                    >
                      {project.requiredSkills?.map(
                        (skill, index) => (

                          <span
                            key={index}
                            className="
                              px-3
                              py-1
                              bg-violet-100
                              dark:bg-violet-900/30
                              text-violet-700
                              dark:text-violet-300
                              rounded-full
                              text-sm
                            "
                          >
                            {skill}
                          </span>

                        )
                      )}
                    </div>

                    {/* =================================
                        Bottom Section
                    ================================== */}

                    <div
                      className="
                        mt-5
                        flex
                        flex-col
                        sm:flex-row
                        sm:justify-between
                        sm:items-center
                        gap-3
                      "
                    >

                      <span
                        className="
                          text-sm
                          text-gray-500
                          dark:text-gray-300
                        "
                      >
                        Team Members :{" "}
                        {project.teamMembers?.length || 0}
                      </span>

                      {/* Buttons */}

                      <div
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          gap-2
                          w-full
                          sm:w-auto
                        "
                      >

                        {/* View Details */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            navigate(
                              `/project/${project._id}`
                            );
                          }}
                          className="
                            w-full
                            sm:w-auto
                            px-4
                            py-2
                            bg-gray-100
                            dark:bg-slate-700
                            text-gray-800
                            dark:text-gray-200
                            rounded-lg
                            hover:bg-gray-200
                            dark:hover:bg-slate-600
                            transition
                          "
                        >
                          View Details
                        </button>

                        {/* Task Board */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            navigate(
                              `/tasks/${project._id}`
                            );
                          }}
                          className="
                            w-full
                            sm:w-auto
                            px-4
                            py-2
                            bg-violet-600
                            hover:bg-violet-700
                            text-white
                            rounded-lg
                            transition
                            font-semibold
                          "
                        >
                          Task Board
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* =====================================
                Empty State
            ====================================== */

            <div
              className="
                bg-white
                dark:bg-slate-800
                border
                border-gray-200
                dark:border-slate-700
                rounded-2xl
                p-8
                md:p-10
                text-center
              "
            >

              <h2
                className="
                  text-xl
                  md:text-2xl
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                No Projects Yet
              </h2>

              <p
                className="
                  text-gray-500
                  dark:text-gray-300
                  mt-2
                "
              >
                Create your first project.
              </p>

              <button
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="
                  mt-6
                  px-6
                  py-3
                  bg-violet-600
                  hover:bg-violet-700
                  text-white
                  rounded-xl
                  transition
                "
              >
                + Create Project
              </button>

            </div>

          )}

        </div>

      </div>

      {/* =========================================
          Create Project Modal
      ========================================== */}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onProjectCreated={fetchProjects}
        />
      )}

    </div>
  );
}

export default MyProjects;