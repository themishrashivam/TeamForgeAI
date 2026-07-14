import { Link } from "react-router-dom";

function MyProjectsSection({ projects = [] }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">
          My Projects
        </h2>

        <Link
          to="/projects"
          className="text-violet-600 font-medium"
        >
          See all
        </Link>
      </div>

      <div className="space-y-4">

        {projects.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No Projects Found
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="border rounded-2xl p-5 flex justify-between items-center"
            >
              <div className="flex gap-4">

                <div className="w-14 h-14 rounded-xl bg-violet-500"></div>

                <div>
                  <h3 className="font-bold text-lg">
                    {project.title}
                  </h3>

                  <p className="text-gray-500 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex mt-3">

                    <img
                      src="https://i.pravatar.cc/30?img=1"
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />

                    <img
                      src="https://i.pravatar.cc/30?img=2"
                      alt=""
                      className="-ml-2 w-8 h-8 rounded-full border-2 border-white"
                    />

                    <img
                      src="https://i.pravatar.cc/30?img=3"
                      alt=""
                      className="-ml-2 w-8 h-8 rounded-full border-2 border-white"
                    />

                  </div>
                </div>

              </div>

              <div className="text-right">

                <span
                  className={`
                    px-3 py-1 rounded-full text-sm
                    ${
                      project.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : project.status === "Open"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {project.status || "Active"}
                </span>

                <p className="mt-4 text-gray-500">
                  {project.teamMembers?.length || 0}
                  {" "}Members
                </p>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default MyProjectsSection;