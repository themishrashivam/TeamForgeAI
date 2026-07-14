import { FaFolder } from "react-icons/fa";
import { Link } from "react-router-dom";

function ActivityFeedSection({
  projects = [],
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Activity Feed
        </h2>

        <Link
          to="/projects"
          className="text-violet-600"
        >
          See all
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No Recent Activity
        </div>
      ) : (
        <div className="space-y-6">

          {projects.map((project) => (
            <div
              key={project._id}
              className="flex gap-4"
            >
              <div
                className="
                  w-12 h-12 rounded-xl
                  flex items-center justify-center
                  bg-violet-100 text-violet-600
                "
              >
                <FaFolder />
              </div>

              <div className="flex-1">

                <h3 className="font-medium">
                  You created a project
                </h3>

                <p className="text-gray-500">
                  {project.title}
                </p>

              </div>

              <p className="text-sm text-gray-400">
                {new Date(
                  project.createdAt
                ).toLocaleDateString()}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default ActivityFeedSection;