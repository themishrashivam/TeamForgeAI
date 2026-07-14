import { Link } from "react-router-dom";

function RecommendedProjectsSection({
  projects = [],
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Recommended Projects for You
        </h2>

        <Link
          to="/explore"
          className="text-violet-600 font-medium"
        >
          See all
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No Recommended Projects
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">

          {projects.map((project) => (
            <div
              key={project._id}
              className="border rounded-2xl p-5"
            >
              <div className="w-14 h-14 rounded-xl bg-violet-500"></div>

              <h3 className="font-bold mt-4">
                {project.title}
              </h3>

              <p className="text-gray-500 mt-2 line-clamp-2">
                {project.description}
              </p>

              <p className="text-gray-500 mt-4">
                {project.teamMembers?.length || 0}
                {" "}Members
              </p>

              <span className="inline-block mt-4 px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                Recommended
              </span>

              {project.createdBy?.name && (
                <p className="mt-3 text-sm text-gray-400">
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