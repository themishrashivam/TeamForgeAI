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

  const sendJoinRequest = async (
    projectId
    ) => {
    try {

        await api.post(
        "/send",
        {
            projectId,
        }
        );

        alert(
        "Request sent successfully"
        );

    } catch (error) {

        alert(
        error.response?.data?.message
        );

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
    <div className="min-h-screen bg-[#f8f9fc] flex">

      <Sidebar />

      <div className="flex-1 ml-64">

        <Topbar user={user} />

        <div className="p-6">

          <h1 className="text-3xl font-bold">
            Explore Projects
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Discover projects and join teams
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {projects.map((project) => (

              <div
                key={project._id}
                className="
                  bg-white
                  rounded-2xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-lg
                  transition
                "
              >

                <img
                  src={
                    project.image ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                  }
                  alt={project.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <div className="flex justify-between items-center">

                    <h2 className="text-xl font-bold">
                      {project.title}
                    </h2>

                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {project.status || "Active"}
                    </span>

                  </div>

                  <p className="text-gray-600 mt-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">

                    {project.requiredSkills?.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="
                            px-3
                            py-1
                            bg-violet-100
                            text-violet-700
                            rounded-full
                            text-sm
                          "
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                  {/* Creator */}

                  <div className="flex items-center gap-3 mt-5">

                    <img
                      src={
                        project.createdBy
                          ?.profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <h4 className="font-semibold">
                        {project.createdBy?.name}
                      </h4>

                      <p className="text-sm text-gray-500">
                        Project Creator
                      </p>
                    </div>

                  </div>

                 <button
                    onClick={() =>
                        sendJoinRequest(project._id)
                    }
                    className="
                        w-full
                        mt-5
                        py-3
                        bg-violet-600
                        text-white
                        rounded-xl
                    "
                    >
                    Request To Join
                    </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ExploreProjects;