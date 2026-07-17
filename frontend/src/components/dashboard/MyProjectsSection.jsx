import { Link } from "react-router-dom";

function MyProjectsSection({ projects = [] }) {
  return (
    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-3xl
        p-6
        shadow-sm
        border
        border-gray-200
        dark:border-slate-700
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Projects
        </h2>

        <Link
          to="/projects"
          className="text-violet-600 font-medium hover:text-violet-700"
        >
          See all
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-300">
            No Projects Found
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="
                bg-white
                dark:bg-slate-800
                border
                border-gray-200
                dark:border-slate-700
                rounded-2xl
                p-5
                flex
                flex-col
                lg:flex-row
                justify-between
                lg:items-center
                gap-4
                hover:shadow-lg
                transition
              "
            >
              {/* Left Section */}
              <div className="flex gap-4">
                <div
                  className="
                    w-14
                    h-14
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-500
                    to-purple-500
                    shrink-0
                  "
                ></div>

                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {project.title}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-300 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Team Members */}
                  <div className="flex mt-3">
                    <img
                      src="https://i.pravatar.cc/30?img=1"
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800"
                    />

                    <img
                      src="https://i.pravatar.cc/30?img=2"
                      alt=""
                      className="-ml-2 w-8 h-8 rounded-full border-2 border-white dark:border-slate-800"
                    />

                    <img
                      src="https://i.pravatar.cc/30?img=3"
                      alt=""
                      className="-ml-2 w-8 h-8 rounded-full border-2 border-white dark:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-left lg:text-right">
                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
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

                <p className="mt-4 text-gray-500 dark:text-gray-300">
                  {project.teamMembers?.length || 0} Members
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