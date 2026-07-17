import { FaFolder } from "react-icons/fa";
import { Link } from "react-router-dom";

function ActivityFeedSection({ projects = [] }) {
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
          Activity Feed
        </h2>

        <Link
          to="/projects"
          className="text-violet-600 hover:text-violet-700 font-medium"
        >
          See all
        </Link>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-300">
          No Recent Activity
        </div>
      ) : (
        <div className="space-y-5">
          {projects.map((project) => (
            <div
              key={project._id}
              className="
                flex
                flex-col
                sm:flex-row
                gap-4
                sm:items-center
                justify-between
                p-4
                rounded-2xl
                border
                border-gray-200
                dark:border-slate-700
                hover:shadow-lg
                transition
              "
            >
              {/* Left Side */}
              <div className="flex gap-4 items-start sm:items-center flex-1">
                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    bg-violet-100
                    dark:bg-violet-900/30
                    text-violet-600
                    text-lg
                    shrink-0
                  "
                >
                  <FaFolder />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    You created a project
                  </h3>

                  <p className="text-gray-500 dark:text-gray-300">
                    {project.title}
                  </p>
                </div>
              </div>

              {/* Date */}
              <p
                className="
                  text-sm
                  text-gray-400
                  dark:text-gray-500
                  whitespace-nowrap
                "
              >
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeedSection;