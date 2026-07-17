import { Link } from "react-router-dom";

function RecommendedProjectsSection({ projects = [] }) {
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
          Recommended Projects for You
        </h2>

        <Link
          to="/explore"
          className="text-violet-600 font-medium hover:text-violet-700"
        >
          See all
        </Link>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-300">
          No Recommended Projects
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
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
                hover:shadow-lg
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              {/* Project Icon */}
              <div
                className="
                  w-14
                  h-14
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-500
                  to-purple-500
                "
              ></div>

              {/* Title */}
              <h3 className="font-bold text-lg mt-4 text-gray-900 dark:text-white">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 dark:text-gray-300 mt-2 line-clamp-2">
                {project.description}
              </p>

              {/* Members */}
              <p className="text-gray-500 dark:text-gray-300 mt-4">
                {project.teamMembers?.length || 0} Members
              </p>

              {/* Badge */}
              <span
                className="
                  inline-block
                  mt-4
                  px-3
                  py-1
                  rounded-full
                  bg-green-100
                  text-green-600
                  text-sm
                  font-medium
                "
              >
                Recommended
              </span>

              {/* Creator */}
              {project.createdBy?.name && (
                <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                  By {project.createdBy.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendedProjectsSection;