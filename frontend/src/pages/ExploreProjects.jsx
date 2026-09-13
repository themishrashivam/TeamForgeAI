import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

function ExploreProjects() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const sendJoinRequest = async (projectId) => {
    try {
      await api.post("/send", {
        projectId,
      });

      alert("Request sent successfully");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/all");

      setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        bg-[#f8f9fc]
        dark:bg-slate-900
        text-gray-900
        dark:text-white
        transition-colors
        duration-200
      "
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="
          flex-1
          min-w-0
          ml-0
          md:ml-64
        "
      >
        {/* Topbar */}
        <Topbar user={user} />

        {/* Page Content */}
        <main
          className="
            p-4
            sm:p-5
            md:p-6
            lg:p-8
          "
        >
          <div className="max-w-7xl mx-auto">
            {/* Page Heading */}
            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Explore Projects
            </h1>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                mt-2
                mb-6
                sm:mb-8
                text-sm
                sm:text-base
              "
            >
              Discover projects and join teams
            </p>

            {/* Projects Grid */}
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
                sm:gap-6
              "
            >
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="
                    bg-white
                    dark:bg-slate-800
                    rounded-2xl
                    overflow-hidden
                    shadow-sm
                    dark:shadow-black/20
                    border
                    border-gray-100
                    dark:border-slate-700
                    hover:shadow-lg
                    dark:hover:shadow-black/30
                    transition
                    duration-200
                    min-w-0
                  "
                >
                  {/* Project Image */}
                  <img
                    src={
                      project.image ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                    }
                    alt={project.title}
                    className="
                      w-full
                      h-44
                      sm:h-48
                      md:h-52
                      object-cover
                    "
                  />

                  {/* Project Content */}
                  <div className="p-4 sm:p-5">
                    {/* Title + Status */}
                    <div
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        justify-between
                        items-start
                        gap-3
                      "
                    >
                      <h2
                        className="
                          text-lg
                          sm:text-xl
                          font-bold
                          text-gray-900
                          dark:text-white
                          break-words
                          min-w-0
                        "
                      >
                        {project.title}
                      </h2>

                      <span
                        className="
                          shrink-0
                          px-3
                          py-1
                          bg-green-100
                          dark:bg-green-900/30
                          text-green-700
                          dark:text-green-400
                          rounded-full
                          text-xs
                          sm:text-sm
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
                        text-sm
                        sm:text-base
                        leading-6
                        break-words
                      "
                    >
                      {project.description}
                    </p>

                    {/* Required Skills */}
                    <div className="flex flex-wrap gap-2 mt-4">
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
                              text-xs
                              sm:text-sm
                              break-words
                            "
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>

                    {/* Creator */}
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        mt-5
                        min-w-0
                      "
                    >
                      <img
                        src={
                          project.createdBy?.profileImage ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt=""
                        className="
                          w-9
                          h-9
                          sm:w-10
                          sm:h-10
                          rounded-full
                          object-cover
                          shrink-0
                        "
                      />

                      <div className="min-w-0">
                        <h4
                          className="
                            font-semibold
                            text-gray-900
                            dark:text-white
                            text-sm
                            sm:text-base
                            truncate
                          "
                        >
                          {project.createdBy?.name}
                        </h4>

                        <p
                          className="
                            text-xs
                            sm:text-sm
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Project Creator
                        </p>
                      </div>
                    </div>

                    {/* Join Request Button */}
                    <button
                      onClick={() =>
                        sendJoinRequest(project._id)
                      }
                      className="
                        w-full
                        mt-5
                        py-3
                        px-4
                        bg-violet-600
                        hover:bg-violet-700
                        active:bg-violet-800
                        dark:bg-violet-600
                        dark:hover:bg-violet-500
                        text-white
                        rounded-xl
                        text-sm
                        sm:text-base
                        font-medium
                        transition
                        duration-200
                        touch-manipulation
                      "
                    >
                      Request To Join
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
              <div
                className="
                  bg-white
                  dark:bg-slate-800
                  rounded-2xl
                  p-8
                  sm:p-10
                  text-center
                  shadow-sm
                  dark:shadow-black/20
                  border
                  border-gray-100
                  dark:border-slate-700
                "
              >
                <p
                  className="
                    text-gray-500
                    dark:text-gray-400
                    text-sm
                    sm:text-base
                  "
                >
                  No projects available at the moment.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ExploreProjects;